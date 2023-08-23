import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./NavigationMenuOpen.css";

const NavigationMenuOpen = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [error, setError] = useState("");

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/find_matching_sentences?input=${query}`
      );
      setResults(response.data.matching_sentences);
      setResultCount(response.data.matching_sentences.length);
      setError("");
    } catch (error) {
      setError("An error occurred while fetching results.");
      setResults([]);
      setResultCount(0);
    }
  };

  useEffect(() => {
    if (query.trim() !== "") {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div className="menu menu-open">
      <div className="header" onClick={onClose}>
        <div className="menu-title">Menu</div>
        <div className="close-icon">
          <img src={require("../assets/x.png")} alt="Menu Icon" />
        </div>
      </div>
      <div className="input-section">
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent actual form submission
            fetchSearchResults(); // Call your search function
          }}
        >
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
              <p>Number of results: {resultCount}</p>
              <div>
                {error && <p>{error}</p>}
                {results.map((result, index) => (
                  <div key={index}>
                    <p>{result.context}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "20px" }}>
                <button id="replace-button">Replace</button>
                <button id="delete-button">Delete</button>
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
