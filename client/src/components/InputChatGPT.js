import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

const InputChatGPT = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/users/search-history`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch search history');
      }
      const data = await response.json();
      setSearchHistory(data.searchHistory);
    } catch (error) {
      console.error(error);
      // Redirect to login if unauthorized or error occurs
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const updateSearchHistory = async (query, assertion) => {
    try {
      await fetch(`${process.env.REACT_APP_BASE_URL}/api/users/search-history`, {
        method: 'POST',
        body: JSON.stringify({ query, assertion }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      fetchSearchHistory(); // Refresh search history
    } catch (error) {
      console.error(error);
      navigate('/login');
    }
  };

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleClick = async () => {
    try {
      const requestData = {
        input: input,
      };

      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/users/chat`,
        {
          method: 'POST',
          body: JSON.stringify(requestData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to generate output');
      }
      const data = await response.json();
      setOutput(data.output);

      // Update search history
      updateSearchHistory(input, data.output);
    } catch (error) {
      console.error(error);
      // Redirect to login if unauthorized or error occurs
      navigate('/login');
    }
  };

  const restoreSearch = (search) => {
    setInput(search.input);
    setOutput(search.output);
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <label htmlFor="chat-prompt" className="font-bold">
        Input chatGPT prompt(s):
      </label>
      <textarea
        id="chat-prompt"
        className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={input}
        onChange={handleChange}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={handleClick}
      >
        Generate
      </button>
      <div className="prose">
        <ReactMarkdown>{`${output}`}</ReactMarkdown>
      </div>
      {searchHistory.length > 0 ? (
        <div className="mt-4">
          <h2 className="font-bold">Search History:</h2>
          <ul>
            {searchHistory.map((search, index) => (
              <li key={index}>
                <button
                  className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                  onClick={() => restoreSearch(search)}
                >
                  {search.input}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No search history available.</p>
      )}
    </div>
  );
};

export default InputChatGPT;
