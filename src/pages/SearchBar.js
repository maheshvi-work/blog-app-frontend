// SearchBar.js
import React, { useState } from "react";

export default function SearchBar({ value, onSearch, onClear }) {
  const [searchQuery, setSearchQuery] = useState(value);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
    onClear();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="index-align-search">
      <input className="inp"
        placeholder="Search Here..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="index-align-btn" onClick={handleSearch}>
        Search
      </button>
      <button className="index-align-btn" onClick={handleClear}>
        Clear
      </button>
    </div>
  );
}
