import React, { useState } from "react";
import "./App.css";

import NavigationMenuClosed from "./components/NavigationMenuClosed";
import NavigationMenuOpen from "./components/NavigationMenuOpen";
import PdfViewerComponent from "./components/PdfViewerComponent";

const App = () => {
  const [menuExpanded, setMenuExpanded] = useState(false);

  // Define state for search results and random results
  const [searchResults, setSearchResults] = useState([]);
  const [searchCount, setSearchCount] = useState(0);
  const [randomResults, setRandomResults] = useState([]);

  const toggleMenu = () => {
    setMenuExpanded(!menuExpanded);
  };

  const performSearch = async (query) => {
    try {
      const response = await fetch(`/find_matching_sentences?input=${query}`);
      const data = await response.json();
      setSearchResults(data.matching_sentences);
      setSearchCount(data.matching_sentences.length);

      // Generate random indices for displaying random results
      const randomIndices = [];
      while (
        randomIndices.length < 3 &&
        randomIndices.length < data.matching_sentences.length
      ) {
        const randomIndex = Math.floor(
          Math.random() * data.matching_sentences.length
        );
        if (!randomIndices.includes(randomIndex)) {
          randomIndices.push(randomIndex);
        }
      }

      // Extract the random results based on the random indices
      const selectedRandomResults = randomIndices.map(
        (index) => data.matching_sentences[index]
      );
      setRandomResults(selectedRandomResults);
    } catch (error) {
      console.error("Error performing search:", error);
      setSearchResults([]);
      setSearchCount(0);
      setRandomResults([]);
    }
  };

  return (
    <div className="app">
      <NavigationMenuClosed onClick={toggleMenu} />
      {menuExpanded ? (
        <NavigationMenuOpen
          searchFunction={performSearch}
          onClose={toggleMenu}
          searchResults={searchResults}
          randomResults={randomResults} // Pass the random results to the component
        />
      ) : null}
      <div className="PDF-viewer">
        <PdfViewerComponent document={"hemingway.pdf"} />
      </div>
    </div>
  );
};

export default App;
