import React, { useState } from "react";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";

const HamburgerMenu = ({ expanded, onToggle }) => {
  const [results, setResults] = useState([]);

  const handleSearch = (query) => {
    // Implement your search logic here
    // Update 'results' state with search results
  };

  const handleAdd = (word) => {
    // Implement logic to add a word to the corpus
    // Update 'results' state if necessary
  };

  const handleRemove = (word) => {
    // Implement logic to remove a word from the corpus
    // Update 'results' state if necessary
  };

  return (
    <>
      <button
        className={`menu-button ${expanded ? "open" : ""}`}
        onClick={onToggle}
      >
        ☰
      </button>
      <div className={`menu-container ${expanded ? "open" : ""}`}>
        <div className={`menu-content ${expanded ? "open" : ""}`}>
          <h1 className={`app-title ${expanded ? "hidden" : ""}`}>
            Search Engine App
          </h1>
          <div className={`search-container ${expanded ? "hidden" : ""}`}>
            <SearchBar
              onSearch={handleSearch}
              onAdd={handleAdd}
              onRemove={handleRemove}
            />
            <SearchResult results={results} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
