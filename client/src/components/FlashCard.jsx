// FlashCard.js
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import * as PrismStyles from "react-syntax-highlighter/dist/esm/styles/prism";

const getStyleObject = (styleName) => {
  return PrismStyles[styleName] || PrismStyles.prism;
};

const FlashCard = ({ title, query, assertion, timestamp }) => {
  const [selectedStyle, setSelectedStyle] = useState("oneLight");

  useEffect(() => {
    // Get the selected style from local storage
    const savedStyle = localStorage.getItem("selectedStyle");
    if (savedStyle) {
      setSelectedStyle(savedStyle);
    } else {
      // If there isn't a style in local storage, set the default style to "oneLight"
      setSelectedStyle("oneLight");
    }
  }, []);

  return (
    <div className="max-h-[calc(100vh-7.5rem)] overflow-y-auto pr-4">
      <div className="bg-white shadow-md rounded p-4 m-4">
        <h2 className="font-bold text-lg">Current Title: {title}</h2>
        <p className="text-gray-600 text-xs">Original Query: {query}</p>
        <p className="text-gray-600 text-sm mt-2">
          Assertion:{" "}
          <ReactMarkdown
            children={assertion}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    {...rest}
                    PreTag="div"
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    style={getStyleObject(selectedStyle)}
                  />
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </p>
        <span className="text-gray-500 text-xs block mt-2">
          Timestamp: {new Date(timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default FlashCard;
