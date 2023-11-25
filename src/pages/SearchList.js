// SearchResultsPage.js
import React from 'react';
import Post from '../Post';

export default function SearchList({searchResults}) {
    return(searchResults.map((post) => (
        <Post
          
          _id={post._id}
          title={post.title}
          summary={post.summary}
          cover={post.cover}
          content={post.content}
          createdAt={post.createdAt}
          author={post.author}
        />
      )));
}


