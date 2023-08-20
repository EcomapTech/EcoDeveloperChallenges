from flask import Flask, jsonify, request
from gensim.models import Word2Vec

app = Flask(__name__)

# Load the trained Word2Vec model
model = Word2Vec.load('./Word2Vec/trained_word2vec_model.model')

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


@app.route('/similar_words', methods=['GET'])
def get_similar_words():
    query = request.args.get('query')  # Get the query word from the request
    similar_words = model.wv.most_similar(
        query, topn=3)  # Get the most similar words
    return jsonify(similar_words)


@app.route('/add_word', methods=['POST'])
def add_word():
    new_word = request.json['word']  # Get the new word from the request
    # Update the vocabulary with the new word
    model.build_vocab([new_word], update=True)
    return jsonify({'message': f'Word {new_word} added to the search corpus.'})


@app.route('/remove_similar_word', methods=['DELETE'])
def remove_similar_word():
    # Get the target word from the request
    target_word = request.args.get('word')
    most_similar = model.wv.most_similar(target_word, topn=1)[
        0][0]  # Get the most similar word
    # Remove the word by zeroing its vector
    model.wv.vectors[model.wv.vocab[most_similar].index] = 0
    return jsonify({'message': f'Most similar word {most_similar} removed from search results.'})


if __name__ == '__main__':
    app.run(debug=True)
