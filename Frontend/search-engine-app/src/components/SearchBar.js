import React, { useState } from "react";

const SearchBar = ({ onSearch, onAdd, onRemove }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  const handleAdd = () => {
    onAdd(query);
  };

  const handleRemove = () => {
    onRemove(query);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter a word"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleAdd}>Add</button>
      <button onClick={handleRemove}>Remove</button>
    </div>
  );
};

export default SearchBar;
