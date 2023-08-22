// NavigationMenuOpen.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import "./NavigationMenuOpen.css";

const NavigationMenuOpen = ({ searchFunction, onClose }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    searchFunction(query);
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
          placeholder="search text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

NavigationMenuOpen.propTypes = {
  searchFunction: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NavigationMenuOpen;
