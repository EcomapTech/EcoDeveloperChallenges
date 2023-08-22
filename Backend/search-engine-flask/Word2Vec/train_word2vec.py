# ./Word2Vec/train_word2vec.py
import gensim
from gensim.models import Word2Vec
from pathlib import Path
import spacy
from spacy.lang.en import English

# Load the spaCy English model
nlp = English()

# Add the sentencizer component to the pipeline
nlp.add_pipe("sentencizer")

# Load the text from the file
corpus_path = '../corpus/hemingway.txt'
with open(corpus_path, 'r', encoding='utf-8') as file:
    text = file.read()

# Preprocess the text


def preprocess_text(text):
    doc = nlp(text)
    tokenized_corpus = [
        [token.text.lower() for token in sent if not token.is_punct]
        for sent in doc.sents
    ]
    return tokenized_corpus


# Preprocess the text and train the Word2Vec model
tokenized_corpus = preprocess_text(text)
model = Word2Vec(
    sentences=tokenized_corpus,
    vector_size=100,    # Dimensionality of the word vectors
    window=5,           # Maximum distance between the current and predicted word within a sentence
    min_count=5,        # Ignores words with total frequency lower than this
    sg=0,               # Training algorithm: 0 for CBOW, 1 for Skip-gram
    workers=4           # Number of CPU cores to use for training
)

# Save the trained model for future use
model.save('trained_word2vec_model.model')
