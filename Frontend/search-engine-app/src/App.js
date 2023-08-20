import React, { useState } from "react";
import "./App.css";
import HamburgerMenu from "./components/HamburgerMenu";
import TextViewer from "./components/TextViewer";

const App = () => {
  const [menuExpanded, setMenuExpanded] = useState(false);

  const toggleMenu = () => {
    setMenuExpanded(!menuExpanded);
  };

  return (
    <div className="app">
      <HamburgerMenu expanded={menuExpanded} onToggle={toggleMenu} />
      <div className={`text-viewer ${menuExpanded ? "menu-expanded" : ""}`}>
        <TextViewer expanded={menuExpanded} />
      </div>
    </div>
  );
};

export default App;
