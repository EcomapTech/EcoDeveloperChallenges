# word2vec_utils.py
"""Utility functions for the Word2Vec model."""
import logging
from gensim.models import KeyedVectors

# Load the pre-trained Word2Vec model
word2vec_model = KeyedVectors.load_word2vec_format(
    '/Users/duncanwood/Desktop/GoogleNews-vectors-negative300.bin', binary=True)

def find_most_similar_words(query_word, model, word_list, num_results=3, similarity_threshold=0):
    """Find the most similar words to a query word in a given list of words."""
    try:
        # Find similar words with a lower similarity threshold
        similar_words = [
            word for word, score in model.most_similar(
                query_word, topn=num_results * 10) if score >= similarity_threshold]

        # If there are not enough similar words meeting the threshold, add words from the word_list
        if len(similar_words) < num_results:
            remaining = num_results - len(similar_words)
            for word in word_list:
                if word not in similar_words:
                    similar_words.append(word)
                    remaining -= 1
                    if remaining == 0:
                        break

        # If still not enough words, fill the result with additional words from the corpus
        if len(similar_words) < num_results:
            remaining = num_results - len(similar_words)
            for word in word_list:
                if word not in similar_words:
                    similar_words.append(word)
                    remaining -= 1
                    if remaining == 0:
                        break

        # Return the top num_results words with the highest similarity scores, limited to word_list
        filtered_similar_words = [word for word in similar_words if word in word_list][:num_results]

        return {"query_word": query_word, "similar_words": filtered_similar_words}
    except KeyError as exc:
        logging.error("Key error while finding similar words: %s", exc)
        raise KeyError("Word not found in model") from exc
    