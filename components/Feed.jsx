'use client';

import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => (
  <div className='mt-16 prompt_layout'>
    {data.map((post) => (
      <PromptCard
        key={post.id}
        post={post}
        handleTagClick={handleTagClick}
      />
    ))}
  </div>
);

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();

      setPosts(data);
    };

    fetchPosts();
  }, []);

  const filteredPrompts = (searchText) => {
    const regex = new RegExp(searchText, 'i');

    return posts.filter(
      (post) =>
        regex.test(post.creator.username) ||
        regex.test(post.tag) ||
        regex.test(post.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = filteredPrompts(e.target.value);
        setSearchedResults(searchResults);
      }, 500)
    );
  };

  const handleTagClick = (tagLabel) => {
    setSearchText(tagLabel);

    const searchResults = filteredPrompts(tagLabel);
    setSearchedResults(searchResults);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input'
        />
      </form>

      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList
          data={posts}
          handleTagClick={handleTagClick}
        />
      )}
    </section>
  );
};

export default Feed;
