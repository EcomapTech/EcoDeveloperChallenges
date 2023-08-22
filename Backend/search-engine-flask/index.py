# ./search-engine/index.py
from flask import Flask, jsonify, request
import re
import spacy

# Load spaCy model with word vectors
nlp = spacy.load("en_core_web_md")

# Load your corpus and create a list of words
with open('./corpus/hemingway.txt', 'r') as file:
    corpus_text = file.read()
    word_list = corpus_text.split()

excluded_pos = {'CCONJ', 'SCONJ', 'PREP', 'ADP', 'DET', 'PUNCT'}

app = Flask(__name__)


# Define the Flask routes

# Home route

@app.route('/')
def hello():
    return """
    <h1>Welcome to the Search Engine API</h1>
    <p>This API provides the following endpoints:</p>
    <ul>
        <li><a href="/find_matching_sentences?input=word">/find_matching_sentences?input=word</a> - Find sentences containing a word</li>
        <li><a href="/similar_words?input=word">/similar_words?input=word</a> - Get similar words to a query word</li>
        <li><a href="/add_word" target="_blank">/add_word</a> - Add a new word to the search corpus</li>
        <li><a href="/remove_similar_word?word=target_word">/remove_similar_word?word=target_word</a> - Remove the most similar word to a target word</li>
    </ul>
    """

# Define a route that takes an input word and returns matching sentences


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


@app.route('/similar_words', methods=['GET'])
def get_similar_words():
    query_word = request.args.get('input')  # Use 'input' instead of 'query'

    # Check if the query word is recognized by spaCy
    if nlp.vocab[query_word].is_oov:
        return jsonify({'error': 'Query word is out of vocabulary'})

    # Calculate cosine similarities between the query vector and corpus vectors
    similarities = []
    for word in word_list:
        # Check if the corpus word is recognized by spaCy
        if nlp.vocab[word].is_oov:
            continue

        sim = nlp(word).similarity(nlp.vocab[query_word])
        similarities.append((word, sim))

    # Sort the similarities in descending order
    similarities.sort(key=lambda x: x[1], reverse=True)

    # Filter out excluded parts of speech and words that are too similar to the query word
    filtered_similarities = [(word, sim) for word, sim in similarities
                             if nlp(word)[0].pos_ not in excluded_pos and word != query_word]

    # Get the top 3 most similar words
    top_similar_words = filtered_similarities[:3]

    return jsonify({'similar_words': top_similar_words})


if __name__ == '__main__':
    app.run(debug=True)
