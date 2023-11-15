// FlashCard.js
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import * as PrismStyles from "react-syntax-highlighter/dist/esm/styles/prism";

const getStyleObject = (styleName) => {
  return PrismStyles[styleName] || PrismStyles.prism;
};

const FlashCard = ({ title, query, assertion, timestamp }) => {
  const [selectedStyle, setSelectedStyle] = useState("oneLight");

  const handleStyleChange = (e) => {
    setSelectedStyle(e.target.value);
  };

  const styles = [
    "coy",
    "dark",
    "funky",
    "okaidia",
    "solarizedlight",
    "tomorrow",
    "twilight",
    "prism",
    "a11yDark",
    "atomDark",
    "base16AteliersulphurpoolLight",
    "cb",
    "coldarkCold",
    "coldarkDark",
    "coyWithoutShadows",
    "darcula",
    "dracula",
    "duotoneDark",
    "duotoneEarth",
    "duotoneForest",
    "duotoneLight",
    "duotoneSea",
    "duotoneSpace",
    "ghcolors",
    "gruvboxDark",
    "gruvboxLight",
    "holiTheme",
    "hopscotch",
    "lucario",
    "materialDark",
    "materialLight",
    "materialOceanic",
    "nightOwl",
    "nord",
    "oneDark",
    "oneLight",
    "pojoaque",
    "shadesOfPurple",
    "solarizedDarkAtom",
    "synthwave84",
    "vs",
    "vscDarkPlus",
    "xonokai",
    "zTouch",
  ];

  return (
    <div className="max-h-[calc(100vh-7.5rem)] overflow-y-auto pr-4">
      <div>
        <label htmlFor="styleSelect">Select a style:</label>
        <select
          id="styleSelect"
          value={selectedStyle}
          onChange={handleStyleChange}
        >
          {styles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white shadow-md rounded p-4 m-4">
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="text-gray-600 text-xs">Query: {query}</p>
        <p className="text-gray-600 text-sm mt-2">
          Assertion: <ReactMarkdown>{assertion}</ReactMarkdown>
        </p>
        <span className="text-gray-500 text-xs block mt-2">
          Timestamp: {new Date(timestamp).toLocaleString()}
        </span>

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
      </div>
    </div>
  );
};

export default FlashCard;
