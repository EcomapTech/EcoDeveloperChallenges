import React, { useState } from "react";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";

const HamburgerMenu = () => {
  const [results, setResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
        className={`menu-button ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        ☰
      </button>
      <div className={`menu-container ${menuOpen ? "open" : ""}`}>
        <div className={`menu-content ${menuOpen ? "open" : ""}`}>
          <h1 className={`app-title ${menuOpen ? "hidden" : ""}`}>
            Search Engine App
          </h1>
          <div className={`search-container ${menuOpen ? "hidden" : ""}`}>
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
