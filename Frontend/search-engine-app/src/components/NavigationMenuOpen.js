import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./NavigationMenuOpen.css";

const NavigationMenuOpen = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [error, setError] = useState("");
  const [showResultsSection, setShowResultsSection] = useState(true); // State for showing/hiding results section
  const [newWord, setNewWord] = useState(""); // New word for replacement
  const [showReplaceSection, setShowReplaceSection] = useState(false); // State for showing the "Replace with" section
  const [isReplaceCompleted, setIsReplaceCompleted] = useState(false); // New state for indicating replace completion
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleteCompleted, setIsDeleteCompleted] = useState(false);

  const shuffleArray = (array) => {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const highlightQueryWord = (text) => {
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
        `http://localhost:5000/find_matching_sentences?input=${query}`
      );
      const matchingSentences = response.data.matching_sentences;

      const randomized = shuffleArray(matchingSentences);

      setResults(randomized);
      setResultCount(randomized.length);
      setError("");
    } catch (error) {
      setError("An error occurred while fetching results.");
      setResults([]);
      setResultCount(0);
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
        old_word: query,
        new_word: newWord,
      });

      // Update UI or show a success message if needed

      setResults([]);
      setError("");
      setIsDeleteCompleted(false);
      setShowReplaceSection(false);
      setIsReplaceCompleted(true);

      // Hide the results section when replace is completed
      setShowResultsSection(false);
    } catch (error) {
      setError("An error occurred while replacing the word.");
    }
  };
  const handleDelete = async () => {
    setShowDeleteConfirmation(true); // Show the confirmation message
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/remove_similar_word?word=${query}`
      );

      setShowDeleteConfirmation(false);
      setResults([]);
      setError("");
      setIsDeleteCompleted(true);
    } catch (error) {
      setError("An error occurred while deleting results.");
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
            className={query ? "input-filled" : ""}
            placeholder="Search text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={
              showDeleteConfirmation || isDeleteCompleted || isReplaceCompleted
            }
          />
          {/* Results section */}
          {showResultsSection &&
            results.length > 0 &&
            !showDeleteConfirmation &&
            !isDeleteCompleted &&
            !isReplaceCompleted && (
              <div>
                <p className="instances-count">{resultCount} instances found</p>
                <p className="results">Results</p>

                <div className="results-output">
                  {error && <p>{error}</p>}
                  {results.slice(0, 3).map((result, index) => (
                    <div key={index}>
                      {highlightQueryWord(`...${result.context}...`)}
                    </div>
                  ))}
                </div>
                <div className="menu-buttons">
                  <button
                    type="button"
                    className="replace-button"
                    onClick={() => {
                      setShowReplaceSection(true);
                      setShowResultsSection(false); // Hide results when "Replace" is clicked
                    }}
                  >
                    <img
                      src={require("../assets/replace.png")}
                      alt="Menu Icon"
                    />
                  </button>
                  <button
                    type="button"
                    className="menu-button"
                    onClick={handleDelete}
                  >
                    <img
                      src={require("../assets/delete.png")}
                      alt="Menu Icon"
                    />
                  </button>
                </div>
              </div>
            )}

          {/* Replace with section */}
          {showReplaceSection && (
            <div className="replace-section">
              <label htmlFor="newWordInput" className="searchLabel">
                Replace with
              </label>
              <div className="replace-input">
                <input
                  type="text"
                  id="newWordInput"
                  className={newWord ? "input-filled" : ""}
                  placeholder="New word"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  disabled={
                    showDeleteConfirmation ||
                    isDeleteCompleted ||
                    isReplaceCompleted
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
          {isReplaceCompleted && (
            <div className="confirmation-menu">
              <p className="confirmation-text">
                All instances of "{query}" have been replaced with "{newWord}".
              </p>
            </div>
          )}

          {/* Confirmation Message */}
          {showDeleteConfirmation && (
            <div className="confirmation-menu">
              <p className="confirmation-text">
                Confirm deletion of {resultCount} instances of "{query}"?
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
          {isDeleteCompleted && (
            <div>
              <p className="confirmed-text">
                All instances of "{query}" have been deleted.
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
