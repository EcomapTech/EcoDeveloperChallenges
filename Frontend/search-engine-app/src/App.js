// App.js
import React, { useState } from "react";
import "./App.css";

import NavigationMenuClosed from "./components/NavigationMenuClosed";
import NavigationMenuOpen from "./components/NavigationMenuOpen";
import PdfViewerComponent from "./components/PdfViewerComponent";

const App = () => {
  const [menuExpanded, setMenuExpanded] = useState(false);

  const toggleMenu = () => {
    setMenuExpanded(!menuExpanded);
  };

  const performSearch = async (query) => {
    try {
      const response = await fetch(`/api/similar_words?query=${query}`);
      const data = await response.json();
      return { results: data, count: data.length };
    } catch (error) {
      console.error("Error performing search:", error);
      return { results: [], count: 0 };
    }
  };

  return (
    <div className="app">
      <NavigationMenuClosed onClick={toggleMenu} />
      {menuExpanded ? (
        <NavigationMenuOpen
          searchFunction={performSearch}
          onClose={toggleMenu}
        />
      ) : null}
      <div className="PDF-viewer">
        <PdfViewerComponent document={"hemingway.pdf"} />
      </div>
    </div>
  );
};

export default App;
