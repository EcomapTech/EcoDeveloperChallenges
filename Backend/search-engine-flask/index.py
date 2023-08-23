# ./search-engine/index.py
import re
from flask import Flask, jsonify, request
from flask_cors import CORS
import spacy
import numpy as np


# Load spaCy model with word vectors
nlp = spacy.load("en_core_web_md")


# Constants
CORPUS_FILE_PATH = "./corpus/hemingway.txt"
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
CORS(app)


# Define the Flask routes


@app.route('/')
def hello():
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

        word_list.append(new_word)
        save_corpus(word_list)  # Save the updated corpus to file

        return jsonify({"message": f"Word '{new_word}' added to the corpus"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/remove_similar_word', methods=['DELETE'])
def remove_similar_word():
    try:
        target_word = request.args.get('word')

        if target_word is None:
            return jsonify({"error": "Missing 'word' parameter"}), 400

        removed_count = 0

        while target_word in word_list:
            word_list.remove(target_word)
            removed_count += 1

        if removed_count > 0:
            save_corpus(word_list)  # Save the updated corpus to file
            return jsonify({"message": f"Removed {removed_count} occurrences of word '{target_word}' from the corpus"}), 200
        else:
            return jsonify({"error": f"No occurrences of word '{target_word}' found in the corpus"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/replace_word', methods=['PUT'])
def replace_word():
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
            save_corpus(word_list)  # Save the updated corpus to file
            return jsonify({"message": f"Replaced {replaced_count} occurrences of '{old_word}' with '{new_word}' in the corpus"}), 200
        else:
            return jsonify({"error": f"No occurrences of '{old_word}' found in the corpus"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_corpus', methods=['GET'])
def get_corpus():
    return jsonify({"corpus": word_list})


if __name__ == '__main__':
    app.run(debug=True)
