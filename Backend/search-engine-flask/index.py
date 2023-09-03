#./index.py
"""Search Engine API"""
import re
from flask import Flask, jsonify, request
from flask_cors import CORS
import spacy

# Constants
CORPUS_FILE_PATH = "./corpus/hemingway.txt"
CONTEXT_SIZE = 30
EXCLUDED_POS = {'CCONJ', 'SCONJ', 'PREP', 'ADP', 'DET', 'PUNCT'}

# Load spaCy model with word vectors
nlp = spacy.load("en_core_web_md")

app = Flask(__name__)
CORS(app)

def load_corpus(file_path):
    """Load the corpus from a text file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            corpus_text = file.read()
            return corpus_text.split()
    except FileNotFoundError as exc:
        raise FileNotFoundError("Text file not found") from exc

def save_corpus(file_path, new_word_list, encoding='utf-8'):
    """Save the corpus to a text file"""
    global word_list  # pylint: disable=global-statement
    word_list = new_word_list  # Update the global variable
    try:
        with open(file_path, 'w', encoding=encoding) as file:
            file.write(' '.join(new_word_list))
    except FileNotFoundError as exc:
        raise FileNotFoundError("Text file not found") from exc
    
word_list = load_corpus(CORPUS_FILE_PATH)

# Define the Flask routes

@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    return """
    <h1>Welcome to the Search Engine API</h1>
    <p>This API provides the following endpoints:</p>
    <ul>
        <li><a href="/find_matching_sentences?input=word">/find_matching_sentences?input=word</a> - Find sentences containing a word</li>
        <li><a href="/add_word" target="_blank">/add_word</a> - Add a new word to the search corpus</li>
        <li><a href="/remove_similar_word?word=target_word">/remove_similar_word?word=target_word</a> - Remove the most similar word to a target word</li>
        <li><a href="/replace_word" target="_blank">/replace_word</a> - Replace all occurrences of a word in the search corpus</li>
        <li><a href="/get_corpus">/get_corpus</a> - Get the current search corpus</li>
    </ul>
    """

@app.route('/find_matching_sentences', methods=['GET'])
def find_matching_sentences():
    """Find sentences containing a word"""
    input_word = request.args.get('input')
    if not input_word:
        return jsonify({"error": "Input word not provided"})

    try:
        with open('./corpus/hemingway.txt', 'r', encoding='utf-8') as file:  # Specify the encoding
            hemingway = file.read()
    except FileNotFoundError:
        return jsonify({"error": "Text file not found"})

    sentences = re.split(r'(?<=[.!?])\s+', hemingway)
    matching_sentences = []

    for sentence in sentences:
        if re.search(rf'\b{input_word}\b', sentence, re.IGNORECASE):
            match_index = sentence.lower().index(input_word.lower())
            context_size = 30
            context_start = max(match_index - context_size, 0)
            context_end = min(match_index + len(input_word) +
                              context_size, len(sentence))
            context = sentence[context_start:context_end]
            context = context.replace("\n", " ").strip()
            matching_sentences.append({"context": context})

    return jsonify({"matching_sentences": matching_sentences})


@app.route('/add_word', methods=['POST'])
def add_word():
    """Add a new word to the corpus"""
    try:
        data = request.get_json()
        new_word = data.get('word')

        if new_word is None:
            return jsonify({"error": "Missing 'word' parameter"}), 400

        word_list.append(new_word)
        save_corpus(CORPUS_FILE_PATH, word_list)  # Pass file_path and word_list

        return jsonify({"message": f"Word '{new_word}' added to the corpus"}), 201

    except FileNotFoundError as exc:
        return jsonify({"error": f"File not found: {exc}"}), 404
    except IOError as exc:
        return jsonify({"error": f"IO error: {exc}"}), 500
    except Exception as exc: # pylint: disable=W0718
        return jsonify({"error": f"An unexpected error occurred: {exc}"}), 500


# known bug: if you have replaced a word, 
# then delete the replaced word, the original
# word with the same name will still appear in
# the search results
@app.route('/remove_similar_word', methods=['DELETE'])
def remove_similar_word():
    """Remove the most similar word to a target word"""
    try:
        target_word = request.args.get('word')

        if target_word is None:
            return jsonify({"error": "Missing 'word' parameter"}), 400

        removed_count = 0

        while target_word in word_list:
            word_list.remove(target_word)
            removed_count += 1

        if removed_count > 0:
            save_corpus(CORPUS_FILE_PATH, word_list)
            return jsonify({"message": f"Removed {removed_count} occurrences of word '{target_word}' from the corpus"}), 200
        else:
            return jsonify({"error": f"No occurrences of word '{target_word}' found in the corpus"}), 404

    except KeyError as exc:
        return jsonify({"error": f"Key error: {exc}"}), 400
    except ValueError as exc:
        return jsonify({"error": f"Value error: {exc}"}), 400
    except Exception as exc: # pylint: disable=W0718
        return jsonify({"error": f"An unexpected error occurred: {exc}"}), 500


@app.route('/replace_word', methods=['PUT'])
def replace_word():
    """Replace all occurrences of a word in the corpus"""
    try:
        data = request.get_json()
        old_word = data.get('old_word')
        new_word = data.get('new_word')

        if old_word is None or new_word is None:
            return jsonify({"error": "Missing 'old_word' or 'new_word' parameter"}), 400

        replaced_count = 0

        for index, word in enumerate(word_list):
            if word.lower() == old_word.lower():
                word_list[index] = new_word
                replaced_count += 1

        if replaced_count > 0:
            save_corpus(CORPUS_FILE_PATH, word_list)
            return jsonify({"message": f"Replaced {replaced_count} occurrences of '{old_word}' with '{new_word}' in the corpus"}), 200
        else:
            return jsonify({"error": f"No occurrences of '{old_word}' found in the corpus"}), 404

    except KeyError as exc:
        return jsonify({"error": f"Key error: {exc}"}), 400
    except TypeError as exc:
        return jsonify({"error": f"Type error: {exc}"}), 400
    except IndexError as exc:
        return jsonify({"error": f"Index error: {exc}"}), 400
    except Exception as exc: # pylint: disable=W0718
        return jsonify({"error": f"An unexpected error occurred: {exc}"}), 500



@app.route('/get_corpus', methods=['GET'])
def get_corpus():
    """Get the current corpus"""
    return jsonify({"corpus": word_list})


if __name__ == '__main__':
    app.run(debug=True)
