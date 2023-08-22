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

  return (
    <div className="app">
      <NavigationMenuClosed onClick={toggleMenu} />
      {menuExpanded ? (
        <NavigationMenuOpen searchFunction={() => {}} onClose={toggleMenu} />
      ) : null}
      <div className="PDF-viewer">
        <PdfViewerComponent document={"hemingway.pdf"} />
      </div>
    </div>
  );
};

export default App;
