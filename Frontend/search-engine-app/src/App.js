import React, { useState } from "react";
import "./App.css";
import HamburgerMenu from "./components/HamburgerMenu";
import TextViewer from "./components/TextViewer";
import PdfViewerComponent from "./components/PdfViewerComponent";

const App = () => {
  const [menuExpanded, setMenuExpanded] = useState(false);

  const toggleMenu = () => {
    setMenuExpanded(!menuExpanded);
  };

  return (
    <div className="app">
      <HamburgerMenu expanded={menuExpanded} onToggle={toggleMenu} />
      {/* <div className={`text-viewer ${menuExpanded ? "menu-expanded" : ""}`}>
        <TextViewer expanded={menuExpanded} />
      </div> */}
      <div className="PDF-viewer">
        <PdfViewerComponent document={"hemingway.pdf"} />
      </div>
    </div>
  );
};

export default App;
