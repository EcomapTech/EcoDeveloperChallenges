import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./NavigationMenuOpen.css";

const NavigationMenuOpen = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [randomizedResults, setRandomizedResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (results.length > 0) {
      // Randomize the order of results
      const randomized = results.slice();
      for (let i = randomized.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomized[i], randomized[j]] = [randomized[j], randomized[i]];
      }
      setRandomizedResults(randomized);
    }
  }, [results]);

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
            <strong>
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

    return segments.map((segment, index) => (
      <React.Fragment key={index}>{segment}</React.Fragment>
    ));
  };

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/find_matching_sentences?input=${query}`
      );
      const matchingSentences = response.data.matching_sentences;
      setResults(matchingSentences.slice(0, 3));
      setResultCount(Math.min(matchingSentences.length, 3));
      setError("");
    } catch (error) {
      setError("An error occurred while fetching results.");
      setResults([]);
      setResultCount(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSearchResults();
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
        <form onSubmit={handleSubmit}>
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
          />

          {results.length > 0 && (
            <div>
              {/* <p>Number of results: {resultCount}</p> */}
              <p className="instances-count">{resultCount} instances found</p>
              {resultCount > 0 && <p className="results">Results</p>}

              <div className="results-output">
                {error && <p>{error}</p>}
                {randomizedResults.map((result, index) => (
                  <div key={index}>
                    {highlightQueryWord(`...${result.context}...`)}
                  </div>
                ))}
              </div>
              <div className="menu-buttons">
                <button id="replace-button">
                  <img src={require("../assets/replace.png")} alt="Menu Icon" />
                </button>
                <button id="delete-button">
                  <img src={require("../assets/delete.png")} alt="Menu Icon" />
                </button>
              </div>
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
