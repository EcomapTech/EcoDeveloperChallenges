import React from "react";
import styles from "./sidebar.module.css";
import SearchBar from "../searchbar/SearchBar";

export default function SideBar() {
  return (
    <div className={styles.menuContainer}>
      {" "}
      <SearchBar />
    </div>
  );
}
