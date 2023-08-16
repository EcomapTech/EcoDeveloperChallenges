# to set up the virtual environment for the backend
# simply type pipenv shell
# then type pipenv install
# to run the backend type python app.py


from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Corpus of words coming from
# FullStackDeveloperChallenge/corpus/hemingway.txt
corpus = open('./corpus/hemingway.txt', 'r').read().split()

# Search

# Calculate TF-IDF vectors for the corpus
vectorizer = TfidfVectorizer()
corpus_vectors = vectorizer.fit_transform(corpus)


def find_similar_words(query):
    query_vector = vectorizer.transform([query])
    similarities = cosine_similarity(query_vector, corpus_vectors).flatten()
    similar_indices = similarities.argsort()[-3:][::-1]
    similar_words = [corpus[idx] for idx in similar_indices]
    return similar_words


@app.route('/search/<string:query>', methods=['GET'])
def search(query):
    # implement search logic and similarity
    similar_words = find_similar_words(query)
    return jsonify(similar_words)

# Add


@app.route('/add/<string:word>', methods=['POST'])
def add(word):
    corpus.append(word)
    return jsonify({'message': 'Word added successfully'})

# Delete


@app.route('/delete/<string:word>', methods=['DELETE'])
def delete(word):
    if word in corpus:
        corpus.remove(word)
        return jsonify({"message": "Word deleted sucessfully"})
    else:
        return jsonify({"message": "Word not found"})


if __name__ == '__main__':
    app.run(debug=True)
