import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./NavigationMenuOpen.css";

const NavigationMenuOpen = ({ onClose }) => {
  const [state, setState] = useState({
    query: "",
    results: [],
    resultCount: 0,
    error: "",
    showResultsSection: true,
    newWord: "",
    showReplaceSection: false,
    isReplaceCompleted: false,
    showDeleteConfirmation: false,
    isDeleteCompleted: false,
    hasSearched: false, // Flag to track if a search has been attempted
  });

  const shuffleArray = (array) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const highlightQueryWord = (text) => {
    const { query } = state;
    const queryParts = query.toLowerCase().split(" ");
    const segments = [];
    let currentIndex = 0;

    while (currentIndex < text.length) {
      const startIdx = text.toLowerCase().indexOf(queryParts[0], currentIndex);
      if (startIdx === -1) {
        segments.push(text.slice(currentIndex));
        break;
      }

      segments.push(text.slice(currentIndex, startIdx));
      currentIndex = startIdx;

      for (const part of queryParts) {
        if (text.toLowerCase().startsWith(part, currentIndex)) {
          segments.push(
            <strong key={currentIndex}>
              {text.slice(currentIndex, currentIndex + part.length)}
            </strong>
          );
          currentIndex += part.length;
        } else {
          segments.push(text[currentIndex]);
          currentIndex += 1;
        }
      }
    }

    return segments;
  };

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/find_matching_sentences?input=${state.query}`
      );
      const matchingSentences = response.data.matching_sentences;

      const randomized = shuffleArray(matchingSentences);

      setState({
        ...state,
        results: randomized,
        resultCount: randomized.length,
        error: "",
        hasSearched: true, // Set the flag to true after a search attempt
      });
    } catch (error) {
      setState({
        ...state,
        error: "An error occurred while fetching results.",
        results: [],
        resultCount: 0,
        hasSearched: true, // Set the flag to true after a search attempt
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchSearchResults();
    }
  };

  const handleReplace = async () => {
    try {
      await axios.put("http://localhost:5000/replace_word", {
        old_word: state.query,
        new_word: state.newWord,
      });

      // Update UI or show a success message if needed

      setState({
        ...state,
        results: [],
        error: "",
        isDeleteCompleted: false,
        showReplaceSection: false,
        isReplaceCompleted: true,
        showResultsSection: false,
      });
    } catch (error) {
      setState({
        ...state,
        error: "An error occurred while replacing the word.",
      });
    }
  };

  const handleDelete = async () => {
    setState({
      ...state,
      showDeleteConfirmation: true,
    });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/remove_similar_word?word=${state.query}`
      );

      setState({
        ...state,
        showDeleteConfirmation: false,
        results: [],
        error: "",
        isDeleteCompleted: true,
      });
    } catch (error) {
      setState({
        ...state,
        error: "An error occurred while deleting results.",
      });
    }
  };

return (
  <div className="menu menu-open">
    <div className="header" onClick={onClose}>
      <div className="menu-title">Menu</div>
      <div className="close-icon">
        <img src={require("../assets/x.png")} alt="Menu Icon" />
      </div>
    </div>
    <div className="input-section">
      <form>
        <label htmlFor="searchInput" className="searchLabel">
          Search
        </label>
        <input
          type="text"
          id="searchInput"
          className={state.query ? "input-filled" : ""}
          placeholder="Search text"
          value={state.query}
          onChange={(e) => setState({ ...state, query: e.target.value })}
          onKeyDown={handleKeyDown}
          disabled={
            state.showDeleteConfirmation ||
            state.isDeleteCompleted ||
            state.isReplaceCompleted
          }
        />

        {/* Results section */}
        {state.showResultsSection && !state.showDeleteConfirmation && !state.isDeleteCompleted && !state.isReplaceCompleted && (
          <div>
            {state.results.length > 0 ? (
              <>
                <p className="instances-count">{state.resultCount} instances found</p>
                <p className="results">Results</p>

                <div className="results-output">
                  {state.error && <p>{state.error}</p>}
                  {state.results.slice(0, 3).map((result, index) => (
                    <div key={index}>{highlightQueryWord(`...${result.context}...`)}</div>
                  ))}
                </div>
                <div className="menu-buttons">
                  <button
                    type="button"
                    className="replace-button"
                    onClick={() => {
                      setState({ ...state, showReplaceSection: true, showResultsSection: false });
                    }}
                  >
                    <img src={require("../assets/replace.png")} alt="Menu Icon" />
                  </button>
                  <button type="button" className="menu-button" onClick={handleDelete}>
                    <img src={require("../assets/delete.png")} alt="Menu Icon" />
                  </button>
                </div>
              </>
              ) : state.hasSearched && (
                // Display "No results found" only if a search has been attempted
                <p className="noResults">No results found</p>
              )}
            </div>
          )}


        {/* Replace with section */}
        {state.showReplaceSection && (
          <div className="replace-section">
            <label htmlFor="newWordInput" className="searchLabel">
              Replace with
            </label>
            <div className="replace-input">
              <input
                type="text"
                id="newWordInput"
                className={state.newWord ? "input-filled" : ""}
                placeholder="New word"
                value={state.newWord}
                onChange={(e) => setState({ ...state, newWord: e.target.value })}
                disabled={
                  state.showDeleteConfirmation ||
                  state.isDeleteCompleted ||
                  state.isReplaceCompleted
                }
              />
              <div className="replace-container">
                <button
                  type="button"
                  className="replace-button"
                  onClick={handleReplace}
                >
                  <img
                    src={require("../assets/replace-confirm.png")}
                    alt="Menu Icon"
                  />
                </button>
              </div>
            </div>
            <p className="warning">This cannot be reversed!</p>
          </div>
        )}
        {/* Replace completion */}
        {state.isReplaceCompleted && (
          <div className="confirmation-menu">
            <p className="confirmation-text">
              All instances of "{state.query}" have been replaced with "{state.newWord}".
            </p>
          </div>
        )}

        {/* Confirmation Message */}
        {state.showDeleteConfirmation && (
          <div className="confirmation-menu">
            <p className="confirmation-text">
              Confirm deletion of {state.resultCount} instances of "{state.query}"?
            </p>
            <div className="menu-buttons confirmation">
              <button
                type="button"
                className="menu-buttons"
                onClick={confirmDelete} // Use the confirmDelete function
              >
                <img src={require("../assets/delete.png")} alt="Menu Icon" />
              </button>
            </div>
          </div>
        )}

        {/* Delete Completed Message */}
        {state.isDeleteCompleted && (
          <div>
            <p className="confirmed-text">
              All instances of "{state.query}" have been deleted.
            </p>
          </div>
        )}
      </form>
    </div>
  </div>
);

};

NavigationMenuOpen.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default NavigationMenuOpen;