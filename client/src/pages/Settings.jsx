// Settings.js
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import * as PrismStyles from "react-syntax-highlighter/dist/esm/styles/prism";

const getStyleObject = (styleName) => {
  return PrismStyles[styleName] || PrismStyles.prism;
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

const demoQuestion = {
  title: "Sample Title",
  query: "Sample Query",
  assertion: `
This is a **demo** markdown example:

\`\`\`js
// Your code block goes here
console.log("Hello, world!");
\`\`\`

- *Italic text*
- **Bold text**
- [Link](https://www.example.com)
`,
  timestamp: new Date(),
};

const Settings = () => {
  const [selectedStyle, setSelectedStyle] = useState("oneLight");
  const { title, query, assertion, timestamp } = demoQuestion;

  useEffect(() => {
    // Get the selected style from local storage
    const savedStyle = localStorage.getItem("selectedStyle");
    if (savedStyle && styles.includes(savedStyle)) {
      setSelectedStyle(savedStyle);
    } else {
      // If there isn't a style in local storage, set the default style to "oneLight"
      setSelectedStyle("oneLight");
    }
  }, []);

  const handleStyleChange = (e) => {
    const newSelectedStyle = e.target.value;
    setSelectedStyle(newSelectedStyle);
    // Save the selected style to local storage
    localStorage.setItem("selectedStyle", newSelectedStyle);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] max-h-[calc(100vh-7.5rem)] overflow-y-auto pr-4 dark:bg-gray-800 dark:text-white">
      {/* Style Dropdown Menu */}
      <div className="text-center">
        <label
          htmlFor="styleSelect"
          className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
        >
          Select a style:
        </label>
        <div className="flex justify-center">
          <select
            id="styleSelect"
            value={selectedStyle}
            onChange={handleStyleChange}
            className="px-2 py-1 border rounded-md shadow-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:border-gray-600"
          >
            {styles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-md rounded p-4 m-4">
        <h2 className="font-bold text-lg dark:text-white">Title: {title}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-xs">
          Query: {query}
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
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
        <span className="text-gray-500 dark:text-gray-400 text-xs block mt-2">
          Timestamp: {new Date(timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default Settings;
