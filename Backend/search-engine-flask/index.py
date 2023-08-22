# ./search-engine/index.py
from flask import Flask, jsonify, request
import re
import spacy
import numpy as np


# Load spaCy model with word vectors
nlp = spacy.load("en_core_web_md")


# Constants
CORPUS_FILE_PATH = "../corpus/hemmingway.txt"
# Excluded parts of speech
EXCLUDED_POS = {'CCONJ', 'SCONJ', 'PREP', 'ADP',
                'DET', 'PUNCT'}


def load_corpus():
    with open(CORPUS_FILE_PATH, 'r') as file:
        corpus_text = file.read()
        return corpus_text.split()


def save_corpus(word_list):
    with open(CORPUS_FILE_PATH, 'w') as file:
        file.write(' '.join(word_list))


word_list = load_corpus()

app = Flask(__name__)

# Define the Flask routes


@app.route('/')
def hello():
    return """
    <h1>Welcome to the Search Engine API</h1>
    <p>This API provides the following endpoints:</p>
    <ul>
        <li><a href="/similar_words?query=word">/similar_words?query=word</a> - Get similar words to a query word</li>
        <li><a href="/add_word" target="_blank">/add_word</a> - Add a new word to the search corpus</li>
        <li><a href="/remove_similar_word?word=target_word">/remove_similar_word?word=target_word</a> - Remove the most similar word to a target word</li>
    </ul>
    """

# Define the Flask routes


@app.route('/find_matching_sentences', methods=['GET'])
def find_matching_sentences():
    input_word = request.args.get('input')
    if not input_word:
        return jsonify({"error": "Input word not provided"})

    try:
        with open('./corpus/hemingway.txt', 'r') as file:
            hemingway = file.read()
    except FileNotFoundError:
        return jsonify({"error": "Text file not found"})

    sentences = re.split(r'(?<=[.!?])\s+', hemingway)
    matching_sentences = []

    for sentence in sentences:
        if re.search(r'\b{}\b'.format(input_word), sentence, re.IGNORECASE):
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
    try:
        data = request.get_json()
        new_word = data.get('word')

        if new_word is None:
            return jsonify({"error": "Missing 'word' parameter"}), 400

        # Add the new word to the corpus
        word_list.append(new_word)

        return jsonify({"message": f"Word '{new_word}' added to the corpus"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/remove_similar_word', methods=['GET'])
def remove_similar_word():
    try:
        target_word = request.args.get('word')

        if target_word is None:
            return jsonify({"error": "Missing 'word' parameter"}), 400

        # Prioritize exact matches
        if target_word in word_list:
            most_similar_word = target_word
        else:
            # Convert word indexes to numpy arrays for cosine similarity calculation
            target_word_index = word_list.index(
                target_word) if target_word in word_list else -1
            word_indices = np.arange(len(word_list))

            # Calculate cosine similarities
            similarities = np.array([1 - np.dot(target_word_index, word_index) / (np.linalg.norm(target_word_index) * np.linalg.norm(word_index))
                                    for word_index in word_indices])

            most_similar_index = np.argmax(similarities)
            most_similar_word = word_list[most_similar_index]

        # Remove the most similar word from the corpus
        if most_similar_word in word_list:
            word_list.remove(most_similar_word)
            save_corpus(word_list)  # Save the updated corpus to file

            return jsonify({"message": f"Word '{most_similar_word}' removed from the corpus"}), 200
        else:
            return jsonify({"error": "No similar words found in the corpus"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 5000


@app.route('/get_corpus', methods=['GET'])
def get_corpus():
    return jsonify({"corpus": word_list})


if __name__ == '__main__':
    app.run(debug=True)
