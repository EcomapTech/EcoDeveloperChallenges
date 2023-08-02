import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";
import { ToastContainer, toast } from "react-toastify";
import {
  searchSimilarWords,
  addWord,
  removeSimilarWord,
} from "../../services/searchApi";

export default function SearchBar() {
  const [searchResults, setSearchResults] = useState([]);
  const inputVal = useRef();

  const handleSearch = async () => {
    try {
      const results = await searchSimilarWords(inputVal.current?.value);
      setSearchResults(results.results);
    } catch (error) {
      console.error("Error searching similar words:", error);
    }
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    try {
      await addWord(inputVal.current?.value);
      toast.success(
        `Word ${inputVal.current?.value} has been added Successfully.`,
        {
          position: "top-center",
          autoClose: 5000,
          theme: "light",
          closeOnClick: true,
        }
      );
      handleSearch();
    } catch (error) {
      toast.error("Error adding word:", error);
    }
  };

  const handleRemoveWord = async (e) => {
    e.preventDefault();
    try {
      await removeSimilarWord(inputVal.current?.value);
      handleSearch();
      toast.success(
        `Word ${inputVal.current?.value} has been removed Successfully.`,
        {
          position: "top-center",
          autoClose: 5000,
          theme: "light",
          closeOnClick: true,
        }
      );
    } catch (error) {
      toast.error("Error removing similar word:", error);
    }
  };

  useEffect(() => {}, [searchResults]);
  return (
    <>
      <ToastContainer />
      <form>
        <div className={styles.searchWrapper}>
          <h3>Search:</h3>
          <div className={styles.row}>
            <input
              className={styles.inputField}
              onChange={handleSearch}
              ref={inputVal}
              type="text"
              placeholder="Search..."
            />
            <button
              className={styles.closeIcon}
              onClick={() => setSearchResults("")}
              type="reset"
            ></button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className={styles.resultWrapper}>
            <h3>Results:</h3>
            <ul>
              {searchResults?.map((result, index) => (
                  <li key={index}>{result}</li>
              ))}

              <div className="row">
                <button
                  className={styles.button}
                  onClick={(e) => handleAddWord(e)}
                >
                  Add
                </button>
                <button
                  className={styles.button}
                  onClick={(e) => handleRemoveWord(e)}
                >
                  Remove
                </button>
              </div>
            </ul>
          </div>
        )}
      </form>
    </>
  );
}
