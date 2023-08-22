// NavigationMenuClosed.js
import React from "react";
import "./NavigationMenuClosed.css";

const NavigationMenuClosed = ({ onClick }) => {
  return (
    <div className="nav-menu">
      <nav className="nav-open" onClick={onClick}>
        <div className="menu-icon">
          <img src={require("../assets/menu.png")} alt="Menu Icon" />
        </div>
        <div className="menu-text">Menu</div>
      </nav>
    </div>
  );
};

export default NavigationMenuClosed;
