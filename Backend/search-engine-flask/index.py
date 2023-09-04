# ./index.py
"""Search Engine API"""

import re
import logging
import spacy
from flask import Flask, jsonify, request
from flask_cors import CORS
from .config import CORPUS_FILE_PATH, CONTEXT_SIZE
# from config import EXCLUDED_POS

# Load spaCy model with word vectors
nlp = spacy.load("en_core_web_md")

# Create a Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Helper function for file operations
def file_operation(file_path, operation, data=None, encoding='utf-8'):
    """
    Helper function for file operations.

    :param file_path: The path to the file.
    :param operation: The operation to perform ('read' or 'write').
    :param data: Data to write to the file (only used for 'write' operation).
    :param encoding: The encoding for file operations.
    :return: Success message or error message.
    """
    try:
        if operation == 'read':
            with open(file_path, 'r', encoding=encoding) as file:
                return file.read()
        elif operation == 'write':
            with open(file_path, 'w', encoding=encoding) as file:
                file.write(data)
            return "write successful"
    except FileNotFoundError as exc:
        logging.error("Error in file operation: %s", exc)
        raise FileNotFoundError("Text file not found") from exc
    except Exception as exc: # pylint: disable=W0718
        logging.error("Error in file operation: %s", exc)
        return "exception occurred"
    return None

# Load the corpus from a text file
def load_corpus(file_path):
    """
    Load the corpus from a text file.

    :param file_path: The path to the corpus file.
    :return: List of words from the corpus.
    """
    try:
        corpus_text = file_operation(file_path, 'read')
        return corpus_text.split()
    except FileNotFoundError as exc:
        raise exc

# Save the corpus to a text file
def save_corpus(file_path, new_word_list, encoding='utf-8'):
    """
    Save the corpus to a text file.

    :param file_path: The path to the corpus file.
    :param new_word_list: List of words to save to the file.
    :param encoding: The encoding for file operations.
    :return: The saved word list.
    """
    try:
        file_operation(file_path, 'write', ' '.join(new_word_list), encoding=encoding)
        return new_word_list
    except FileNotFoundError as exc:
        raise exc

# Load the initial word list from the corpus file
word_list = load_corpus(CORPUS_FILE_PATH)

# Define a reusable input validation function
def validate_input_string(input_value, field_name):
    """
    Validate that an input value is a non-empty string.

    :param input_value: The input value to validate.
    :param field_name: The name of the input field (for error messages).
    :return: None if input is valid, error message if not.
    """
    if not input_value or not isinstance(input_value, str) or not input_value.strip():
        return f"Invalid or missing {field_name}"
    return None

# Define the Flask routes

# Route for a friendly greeting
@app.route('/')
def hello():
    """
    Return a friendly HTTP greeting and list of available endpoints.
    """
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


# Route to find sentences containing a word
@app.route('/find_matching_sentences', methods=['GET'])
def find_matching_sentences():
    """
    Find sentences containing a word.

    Expects 'input' as a query parameter specifying the word to search for.
    """
    input_word = request.args.get('input')

    # Validate input_word using the input validation function
    validation_error = validate_input_string(input_word, 'input word')
    if validation_error:
        return jsonify({"error": validation_error}), 400

    try:
        with open(CORPUS_FILE_PATH, 'r', encoding='utf-8') as file:
            hemingway = file.read()
    except FileNotFoundError as exc:
        logging.error("Error reading corpus file: %s", exc)
        return jsonify({"error": "Text file not found"}), 404

    sentences = re.split(r'(?<=[.!?])\s+', hemingway)
    matching_sentences = []

    for sentence in sentences:
        try:
            if re.search(rf'\b{input_word}\b', sentence, re.IGNORECASE):
                match_index = sentence.lower().index(input_word.lower())
                context_start = max(match_index - CONTEXT_SIZE, 0)
                context_end = min(match_index + len(input_word) + CONTEXT_SIZE, len(sentence))
                context = sentence[context_start:context_end]
                context = context.replace("\n", " ").strip()
                matching_sentences.append({"context": context})
        except ValueError as exc:
            logging.warning("Error processing sentence: %s", exc)

    return jsonify({"matching_sentences": matching_sentences})


# Route to add a new word to the corpus
@app.route('/add_word', methods=['POST'])
def add_word():
    """
    Add a new word to the corpus.

    Expects a JSON object with a 'word' field specifying the new word.
    """
    try:
        data = request.get_json()
        new_word = data.get('word')

        if new_word is None:
            return jsonify({"error": "Missing 'word' parameter"}), 400

        # Validate new_word using the input validation function
        validation_error = validate_input_string(new_word, 'new word')
        if validation_error:
            return jsonify({"error": validation_error}), 400

        word_list.append(new_word)
        saved_word_list = save_corpus(CORPUS_FILE_PATH, word_list)

        if saved_word_list is None:
            logging.error("Failed to save the updated corpus.")
            return jsonify({"error": "Failed to save the updated corpus"}), 500

        return jsonify({"message": f"Word '{new_word}' added to the corpus"}), 201

    except IOError as exc:
        logging.error("IO error while adding a word: %s", exc)
        return jsonify({"error": f"IO error: {exc}"}), 500
    except Exception as exc:  # pylint: disable=W0718
        logging.error(
            "An unexpected error occurred while adding a word: %s", exc)
        return jsonify({"error": f"An unexpected error occurred: {exc}"}), 500

# known bug: if you have replaced a word,
# then delete the replaced word, the original
# word with the same name will still appear in
# the search results
@app.route('/remove_similar_word', methods=['DELETE'])
def remove_similar_word():
    """
    Remove the most similar word to a target word.

    Expects 'word' as a query parameter specifying the target word to remove.
    """
    try:
        target_word = request.args.get('word')

        # Validate target_word using the input validation function
        validation_error = validate_input_string(target_word, 'target word')
        if validation_error:
            return jsonify({"error": validation_error}), 400

        removed_count = 0

        # Remove all occurrences of the target word from the corpus
        while target_word in word_list:
            word_list.remove(target_word)
            removed_count += 1

        save_corpus(CORPUS_FILE_PATH, word_list)

        if removed_count > 0:
            message = f"Removed {removed_count} occurrences of word '{target_word}' from the corpus"
            return jsonify({"message": message}), 200

        error_message = f"No occurrences of word '{target_word}' found in the corpus"
        return jsonify({"error": error_message}), 404

    except KeyError as exc:
        error_message = f"Key error: {exc}"
        logging.error("Key error while removing a similar word: %s", exc)
        return jsonify({"error": error_message}), 400
    except Exception as exc: # pylint: disable=W0718
        error_message = f"An unexpected error occurred: {exc}"
        logging.error(
            "An unexpected error occurred while removing a similar word: %s", exc)
        return jsonify({"error": error_message}), 500


@app.route('/replace_word', methods=['PUT'])
def replace_word():
    """
    Replace all occurrences of a word in the corpus.

    Expects a JSON object with 'old_word' and 'new_word' fields to specify the replacement.
    """
    try:
        data = request.get_json()
        old_word = data.get('old_word')
        new_word = data.get('new_word')

        # Validate old_word and new_word using the input validation function
        validation_error_old = validate_input_string(old_word, 'old word')
        validation_error_new = validate_input_string(new_word, 'new word')

        if validation_error_old:
            return jsonify({"error": validation_error_old}), 400

        if validation_error_new:
            return jsonify({"error": validation_error_new}), 400

        replaced_count = 0

        # Replace all occurrences of old_word with new_word in the corpus
        for index, word in enumerate(word_list):
            if word.lower() == old_word.lower():
                word_list[index] = new_word
                replaced_count += 1

        save_corpus(CORPUS_FILE_PATH, word_list)

        if replaced_count > 0:
            return jsonify({"message": f"Replaced {replaced_count} \
                            occurrences of '{old_word}' with '{new_word}' in the corpus"}), 200
        return jsonify({"error": f"No occurrences of '{old_word}' found in the corpus"}), 404

    except Exception as exc: # pylint: disable=W0718
        logging.error(
            "An unexpected error occurred while replacing a word: %s", exc)
        return jsonify({"error": f"An unexpected error occurred: {exc}"}), 500


@app.route('/get_corpus', methods=['GET'])
def get_corpus():
    """
    Get the current corpus as a JSON response.
    """
    try:
        return jsonify({"corpus": word_list})
    except Exception as exc: # pylint: disable=W0718
        logging.error(
            "An unexpected error occurred while retrieving the corpus: %s", exc)
        return jsonify({"error": f"An unexpected error occurred: {exc}"}), 500

# Start the Flask app if the script is executed directly
if __name__ == '__main__':
    app.run(debug=True)
