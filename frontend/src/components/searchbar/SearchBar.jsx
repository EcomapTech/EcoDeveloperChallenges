import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";
import { ToastContainer, toast } from "react-toastify";
import {
  searchSimilarWords,
  addWord,
  removeSimilarWord,
} from "../../services/searchApi";
import Button from "../button/Button";

export default function SearchBar() {
  const [searchResults, setSearchResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [searchStatus, setSearchStatus] = useState(false);

  let inputVal = useRef();

  const handleSearch = async () => {
    const inputValue = inputVal.current?.value.trim();

    if (!inputValue) {
      setSearchResults("");
      setResultCount(0);
      return;
    }

    try {
      const results = await searchSimilarWords(inputVal.current?.value);
      setSearchStatus(true);
      setSearchResults(results?.results.similarWords);
      setResultCount(results?.results.count);
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
    setSearchStatus(true);

    try {
      setDeleteStatus(false);

      await removeSimilarWord(searchResults[0]);
      setSearchResults("");
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
      setSearchStatus(false);
    } catch (error) {
      toast.error("Error removing similar word:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Backspace" || event.keyCode === 8) {
      setSearchStatus(false);
      setSearchResults("");
    }

    if (event.key === "Enter") {
      // setSearchStatus(true);

      // Handle the "Enter" key press here
      event.preventDefault();
      handleSearch();
    }
  };

  const handleDelete = async (event) => {
    setSearchStatus(false);

    event.preventDefault();
    setDeleteStatus(true);
  };

  useEffect(() => {}, [searchResults, inputVal]);
  return (
    <>
      <ToastContainer />
      {!deleteStatus ? (
        <form>
          <div className={styles.searchWrapper}>
            <h3>Search:</h3>
            <div className={styles.row}>
              <input
                className={styles.inputField}
                // onChange={handleSearch}
                ref={inputVal}
                type="text"
                placeholder="Search text"
                onKeyDown={handleKeyPress}
              />
            </div>
            {searchStatus && (
              <p className={styles.instances}>{resultCount} instances found</p>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className={styles.resultWrapper}>
              <h3>Results:</h3>
              <ul>
                {searchResults?.slice(0, 3).map((result, index) => (
                  <li key={index}>{result}</li>
                ))}

                <div className={styles.buttonRow}>
                  <Button
                    content="Update"
                    type="update"
                    onClick={(e) => handleAddWord(e)}
                  />
                  <Button
                    content="Delete"
                    type="delete"
                    onClick={(e) => handleDelete(e)}
                  />
                </div>
              </ul>
            </div>
          )}
        </form>
      ) : (
        <div className={styles.deleteContainer}>
          <p className={styles.deleteMessage}>
            Confirm deletion of first instance of "{inputVal.current.value}"?
          </p>

          <Button
            content="Delete"
            type="delete"
            onClick={(e) => handleRemoveWord(e)}
          />
        </div>
      )}
    </>
  );
}
