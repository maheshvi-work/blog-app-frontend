// IndexPage.js
import React, { useEffect, useState } from "react";
import Post from "../Post";
import SearchBar from "./SearchBar";
import SearchList from "./SearchList";
import FileUpload from "./FileUpload";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (query) => {
    console.log(query);
    try {
      const response = await fetch(`http://localhost:4001/api/post/search/` + query, {
        credentials: 'include',
      });
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  };

  const onSearchInputChange = (query) => {
    setSearchQuery(query);

    // If the search input is blank, show all posts
    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      handleSearch(query);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    fetch('http://localhost:4001/api/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
        console.log(posts);
      });
    });
  }, []);

  return (
    <div className="parent-container">
      <SearchBar
        value={searchQuery}
        onSearch={onSearchInputChange}
        onClear={clearSearch}
      />

      <div className="posts-results">
        {searchResults && searchResults.length > 0 ? (
          <SearchList searchResults={searchResults} />
        ) : (
          posts.length > 0 && posts.map((post) => <Post key={post.id} {...post} />)
        )}
      </div>
      
    </div>
    
  );
}
