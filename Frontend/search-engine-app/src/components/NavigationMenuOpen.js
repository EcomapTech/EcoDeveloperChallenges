import React, { useState } from "react";
import PropTypes from "prop-types";
import "./NavigationMenuOpen.css";

const NavigationMenuOpen = ({ searchFunction, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);

  const handleSearch = async () => {
    const searchResults = await searchFunction(query);
    setResults(searchResults.results);
    setResultCount(searchResults.count);
    // setQuery(""); // Clear the input field
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
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
        <label htmlFor="searchInput" className="searchLabel">
          Search
        </label>
        <input
          type="text"
          id="searchInput"
          className={query ? "input-filled" : ""}
          placeholder="search text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {results.length > 0 && (
          <div>
            <p>Number of results: {resultCount}</p>
            <div>
              {results.map((result, index) => (
                <p key={index}>{result}</p>
              ))}
            </div>
            <div style={{ marginTop: "20px" }}>
              <button id="replace-button">Replace</button>
              <button id="delete-button">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

NavigationMenuOpen.propTypes = {
  searchFunction: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NavigationMenuOpen;
