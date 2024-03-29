import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import {
  BsLayoutSidebarInset,
  BsLayoutSidebarInsetReverse,
} from "react-icons/bs";
import { AiFillEdit, AiFillSave } from "react-icons/ai";
import { FiTrash2, FiCheck, FiX, FiPlus } from "react-icons/fi"; // <-- import the new icons
import FlashCard from "./FlashCard";

const InputChatGPT = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();
  const [editingTitleIndex, setEditingTitleIndex] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    window.innerWidth >= 768
  ); // Default to hidden on small screens
  const [activeSearchIndex, setActiveSearchIndex] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(null); // New state for confirmation dialog
  const inputRef = useRef(null); // Ref for the input element
  const [selectedSearch, setSelectedSearch] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/users/search-history`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search history");
      }
      const data = await response.json();
      const sortedHistory = data.searchHistory.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      const formattedHistory = sortedHistory.map((search) => {
        const relativeTime = getRelativeTime(search.timestamp);
        return {
          ...search,
          relativeTime,
        };
      });
      setSearchHistory(formattedHistory);
    } catch (error) {
      console.error(error);
      // Redirect to login if unauthorized or error occurs
      navigate("/login");
    }
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const searchTime = new Date(timestamp);

    if (
      now.getDate() === searchTime.getDate() &&
      now.getMonth() === searchTime.getMonth()
    ) {
      return "Today";
    } else {
      const timeDiff = now.getTime() - searchTime.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff === 1) {
        return "Yesterday";
      } else if (daysDiff <= 7) {
        return "Previous 7 Days";
      } else if (daysDiff <= 30) {
        return "Previous 30 Days";
      } else {
        return "More than 30 Days";
      }
    }
  };

  useEffect(() => {
    fetchSearchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSearchHistory = async (query, assertion, title) => {
    try {
      await fetch(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/users/search-history`,
        {
          method: "POST",
          body: JSON.stringify({ query, assertion, title }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      fetchSearchHistory(); // Refresh search history
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  };

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleClick = async () => {
    try {
      setIsLoading(true); // Start loading

      const requestData = {
        input: input,
      };

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/users/chat`,
        {
          method: "POST",
          body: JSON.stringify(requestData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to generate output");
      }
      const data = await response.json();
      setOutput(data.output);

      // Update search history
      updateSearchHistory(input, data.output, input);
    } catch (error) {
      console.error(error);
      // Redirect to login if unauthorized or error occurs
      navigate("/login");
    } finally {
      setIsLoading(false); // Stop loading when data is loaded or an error occurs
    }
  };

  const restoreSearch = async (searchId) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/users/search-history/${searchId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search history");
      }
      const search = await response.json();
      setInput(search.query);
      setOutput(search.assertion);
      // Set the selected search for FlashCard
      setSelectedSearch(search);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTitle = async (searchId, title) => {
    try {
      await fetch(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/users/search-history/${searchId}`,
        {
          method: "PUT",
          body: JSON.stringify({ title }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      fetchSearchHistory(); // Refresh search history
      setSelectedSearch((prevSearch) => ({ ...prevSearch, title })); // Update the title in selectedSearch
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUserSearchHistory = async (searchId) => {
    try {
      await fetch(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/users/search-history/${searchId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      fetchSearchHistory(); // Refresh search history
      setShowConfirmation(null); // Reset the showConfirmation state
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewQuestionClick = () => {
    setSelectedSearch(null);
    setInput("");
    setOutput("");
    setActiveSearchIndex(null); // Deselect the current title
  };

  useEffect(() => {
    if (editingTitleIndex !== null) {
      // Focus the input box when editingTitleIndex changes
      inputRef.current.focus();
    }
  }, [editingTitleIndex]);

  useEffect(() => {
    if (selectedSearch) {
      // Update the selectedSearch when editingTitleIndex changes
      setSelectedSearch((prevSearch) => ({
        ...prevSearch,
        title: editedTitle,
      }));
    }
  }, [editingTitleIndex]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-100 dark:bg-gray-900 transition-all ease-in-out duration-300 ${
          isSidebarVisible ? "w-96" : "w-16 bg-white dark:bg-gray-800"
        }`}
        style={{ height: `calc(100vh - 4rem)` }} // Adjust the height based on your navbar's height
      >
        {/* Toggle sidebar button */}
        <div className="p-4 flex justify-center items-center">
          <button
            className={`text-black hover:bg-gray-300 p-2 rounded-full dark:text-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          >
            {isSidebarVisible ? (
              <BsLayoutSidebarInsetReverse size={24} />
            ) : (
              <BsLayoutSidebarInset size={24} />
            )}
          </button>
        </div>

        {/* Search History */}
        {isSidebarVisible && (
          <div className="p-4 flex flex-col">
            <div className="flex justify-center m-4">
              <button
                className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center dark:bg-blue-800 dark:hover:bg-blue-700`}
                onClick={handleNewQuestionClick}
              >
                <FiPlus size={16} className="mr-1" />
                New Question
              </button>
            </div>
            <div className="max-h-[calc(100vh-15rem)] overflow-y-auto pr-4">
              {searchHistory.map((search, index) => (
                <React.Fragment key={index}>
                  {index === 0 ||
                  search.relativeTime !==
                    searchHistory[index - 1].relativeTime ? (
                    <div className="text-gray-500 mb-2">
                      {search.relativeTime}
                    </div>
                  ) : null}
                  <div
                    className={`flex items-center justify-between mb-2 p-2 rounded transition-colors duration-200 ${
                      editingTitleIndex === index
                        ? "bg-blue-100 dark:bg-blue-700"
                        : activeSearchIndex === index
                        ? "bg-gray-300 dark:bg-gray-600"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      {showConfirmation === index && (
                        <span className="text-gray-500 hover:text-gray-700 mr-2">
                          <FiTrash2 size={16} />
                        </span>
                      )}
                      <button
                        className={`text-blue-600 hover:text-blue-800 hover:underline focus:outline-none text-left truncate flex-1 dark:text-blue-400`}
                        onClick={() => {
                          setActiveSearchIndex(index);
                          restoreSearch(search._id);
                        }}
                      >
                        {editingTitleIndex === index ? (
                          <input
                            ref={inputRef}
                            type="text"
                            value={editedTitle}
                            className="bg-white dark:bg-gray-800 dark:text-white"
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onBlur={() => {
                              setEditingTitleIndex(null);
                              updateTitle(search._id, editedTitle);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
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
                    </div>
                    <div>
                      {showConfirmation !== index && (
                        <>
                          <button
                            className={`text-gray-500 hover:text-gray-700 ml-2 dark:text-gray-400`}
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
                          {editingTitleIndex !== index && (
                            <button
                              className={`text-gray-500 hover:text-gray-700 ml-2 dark:text-gray-400`}
                              onClick={() => setShowConfirmation(index)}
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </>
                      )}
                      {showConfirmation === index && (
                        <>
                          <button
                            className={`text-gray-500 hover:text-gray-700 ml-2 dark:text-gray-400`}
                            onClick={() => deleteUserSearchHistory(search._id)}
                          >
                            <FiCheck size={16} />
                          </button>
                          <button
                            className={`text-gray-500 hover:text-gray-700 ml-2 dark:text-gray-400`}
                            onClick={() => setShowConfirmation(null)}
                          >
                            <FiX size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Container for Main Content and Flash Card */}
      <div className="flex flex-col w-full">
        {/* Main content */}
        {!selectedSearch && (
          <div className="px-4 py-6 flex-1 text-center">
            <div className="bg-white shadow-md rounded p-4 m-4 dark:bg-gray-900">
              <div className="flex flex-col gap-4">
                <label htmlFor="chat-prompt" className="font-bold text-lg">
                  Input chatGPT prompt(s):
                </label>
                <textarea
                  id="chat-prompt"
                  className={`border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white`}
                  value={input}
                  onChange={handleChange}
                />
                <button
                  className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-800 dark:hover:bg-blue-700`}
                  onClick={handleClick}
                  disabled={isLoading} // Disable the button while loading
                >
                  {isLoading ? "Loading..." : "Generate"}{" "}
                  {/* Show "Loading..." while loading */}
                </button>
                <div className="prose">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flash Card section */}
        {selectedSearch && (
          <div className="px-4 py-6 flex-1">
            <FlashCard
              title={selectedSearch.title || selectedSearch.query}
              query={selectedSearch.query}
              assertion={selectedSearch.assertion}
              timestamp={selectedSearch.timestamp}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InputChatGPT;
