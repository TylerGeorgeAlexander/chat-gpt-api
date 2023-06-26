import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { BsLayoutSidebarInset } from 'react-icons/bs';
import { AiFillEdit, AiFillSave } from 'react-icons/ai';
import { FiTrash2, FiCheck, FiX } from 'react-icons/fi'; // <-- import the new icons

const InputChatGPT = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth >= 768); // Default to hidden on small screens
  const [activeSearchIndex, setActiveSearchIndex] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(null); // New state for confirmation dialog

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/users/search-history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSearchHistory = async (query, assertion, title) => {
    try {
      await fetch(`${process.env.REACT_APP_BASE_URL}/api/users/search-history`, {
        method: 'POST',
        body: JSON.stringify({ query, assertion, title }),
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

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/users/chat`, {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to generate output');
      }
      const data = await response.json();
      setOutput(data.output);

      // Update search history
      updateSearchHistory(input, data.output, input);
    } catch (error) {
      console.error(error);
      // Redirect to login if unauthorized or error occurs
      navigate('/login');
    }
  };

  const restoreSearch = async (searchId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/users/search-history/${searchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch search history');
      }
      const search = await response.json();
      setInput(search.query);
      setOutput(search.assertion);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTitle = async (searchId, title) => {
    try {
      await fetch(`${process.env.REACT_APP_BASE_URL}/api/users/search-history/${searchId}`, {
        method: 'PUT',
        body: JSON.stringify({ title }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      fetchSearchHistory(); // Refresh search history
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUserSearchHistory = async (searchId) => {
    try {
      await fetch(`${process.env.REACT_APP_BASE_URL}/api/users/search-history/${searchId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      fetchSearchHistory(); // Refresh search history
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (searchId) => {
    const confirmed = window.confirm('Are you sure you want to delete this search history?');
    if (confirmed) {
      deleteUserSearchHistory(searchId);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-100 transition-all duration-300 ${isSidebarVisible ? 'w-3/12' : 'w-12'
          }`}
        style={{ height: '100vh' }}
      >
        {/* Toggle sidebar button */}
        <div className="p-4">
          <button
            className="text-black hover:text-gray-300 mb-4"
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          >
            <BsLayoutSidebarInset size={24} />
          </button>
        </div>

        {/* Search History */}
        {isSidebarVisible && (
          <div className="p-4">
            {searchHistory.map((search, index) => (
              <div
                key={index}
                className={`flex items-center justify-between mb-2 p-2 rounded transition-colors duration-200 ${editingTitleIndex === index
                  ? 'bg-blue-100'
                  : activeSearchIndex === index
                    ? 'bg-gray-300'
                    : 'hover:bg-gray-200'
                  }`}
              >
                {showConfirmation === index ? (
                  <>
                    <button
                      className="text-red-500 hover:text-red-700 ml-2"
                      onClick={() => deleteUserSearchHistory(search._id)}
                    >
                      <FiCheck size={16} />
                    </button>
                    <button
                      className="text-gray-500 hover:text-gray-700 ml-2"
                      onClick={() => setShowConfirmation(null)}
                    >
                      <FiX size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-red-500 hover:text-red-700 ml-2"
                      onClick={() => setShowConfirmation(index)}
                    >
                      <FiTrash2 size={16} />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none text-left truncate flex-1"
                      onClick={() => {
                        setActiveSearchIndex(index);
                        restoreSearch(search._id);
                      }}
                    >
                      {editingTitleIndex === index ? (
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          onBlur={() => {
                            setEditingTitleIndex(null);
                            updateTitle(search._id, editedTitle);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setEditingTitleIndex(null);
                              updateTitle(search._id, editedTitle);
                            }
                          }}
                        />
                      ) : search.title && search.title.length > 12 ? (
                        `${search.title.slice(0, 12)}...`
                      ) : (
                        search.title || search.query
                      )}
                    </button>
                    <button
                      className="text-gray-500 hover:text-gray-700 ml-2"
                      onClick={() => {
                        if (editingTitleIndex === index) {
                          setEditingTitleIndex(null);
                          updateTitle(search._id, editedTitle);
                        } else {
                          setEditingTitleIndex(index);
                          setEditedTitle(search.title || search.query);
                        }
                      }}
                    >
                      {editingTitleIndex === index ? (
                        <AiFillSave size={16} />
                      ) : (
                        <AiFillEdit size={16} />
                      )}
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="w-full px-4 flex-1 text-center">
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="chat-prompt" className="font-bold">
            Input chatGPT prompt(s):
          </label>
          <textarea
            id="chat-prompt"
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
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
        </div>
      </div>
    </div>
  );
};

export default InputChatGPT;
