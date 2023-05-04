import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const InputChatGPT = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleClick = () => {
    const requestData = {
      input: input,
    };

    fetch(process.env.REACT_APP_URL_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOutput(data.output);
        const updatedSearchHistory = [
          ...searchHistory,
          { input: input, output: data.output },
        ];
        setSearchHistory(updatedSearchHistory);
        localStorage.setItem("searchHistory", JSON.stringify(updatedSearchHistory));
      })
      .catch((error) => {
        console.error(error);
      });
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
    </div>
  );
};

export default InputChatGPT;
