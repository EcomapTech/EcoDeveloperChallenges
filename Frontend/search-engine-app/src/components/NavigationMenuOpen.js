import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./NavigationMenuOpen.css";

const NavigationMenuOpen = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [error, setError] = useState("");
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

  const handleDelete = async () => {
    setShowDeleteConfirmation(true); // Show the confirmation message
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchSearchResults();
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/remove_similar_word?word=${query}`
      );
      const message = response.data.message;
      setShowDeleteConfirmation(false); // Hide the confirmation message
      setResults([]);
      setError("");
      setIsDeleteCompleted(true); // Mark delete as completed
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
          />
          {results.length > 0 &&
            !showDeleteConfirmation &&
            !isDeleteCompleted && (
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
                  <button type="button" className="replace-button">
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
