import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./components/Login";
import RegistrationPage from "./pages/RegistrationPage";
import Dashboard from "./pages/Dashboard";
import LogoutButton from "./components/LogoutButton";
import PrivateWrapper from "./components/PrivateWrapper";
import Settings from "./pages/Settings";
import ToggleSwitch from "./components/ToggleSwitch";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // Toggle dark mode class on the <html> element
  useEffect(() => {
    const htmlElement = document.querySelector("html");
    if (htmlElement) {
      if (isDarkMode) {
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }
    }
    // Update localStorage when isDarkMode changes
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  // Function to toggle between dark and light mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevIsDarkMode) => !prevIsDarkMode);
  };

  useEffect(() => {
    const storedAuthToken = localStorage.getItem("authToken");
    const storedTokenExpiration = localStorage.getItem("tokenExpiration");

    if (
      storedAuthToken &&
      storedTokenExpiration &&
      new Date(storedTokenExpiration) > new Date()
    ) {
      setIsLoggedIn(true);
      setAuthToken(storedAuthToken);
      setTokenExpiration(storedTokenExpiration);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (tokenExpiration && new Date(tokenExpiration) <= new Date()) {
      handleLogout();
    }
  }, [tokenExpiration]);

  const handleLogin = (authTokenFromBackend) => {
    try {
      const decodedToken = JSON.parse(atob(authTokenFromBackend.split(".")[1]));
      const expirationTime = new Date(decodedToken.exp * 1000);

      localStorage.setItem("authToken", authTokenFromBackend);
      localStorage.setItem("tokenExpiration", expirationTime.toISOString());

      setIsLoggedIn(true);
      setAuthToken(authTokenFromBackend);
      setTokenExpiration(expirationTime.toISOString());
    } catch (error) {
      console.error("Error handling login:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiration");
    setIsLoggedIn(false);
    setAuthToken("");
    setTokenExpiration(null);
  };

  return (
    <Router>
      <div
        id="App"
        className={
          isDarkMode
            ? "dark:bg-gray-800 dark:text-white"
            : "bg-white text-black"
        }
      >
        <nav className="navbar bg-gray-900 text-white py-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="navbar__logo">
              <Link to="/" className="text-xl font-bold">
                Chat GPT API Generator
              </Link>
            </div>
            <ul className="navbar__menu flex space-x-4">
              <div className="flex items-center mr-2">
                <ToggleSwitch checked={isDarkMode} onChange={toggleDarkMode} />
                <div className="ml-2">
                  {isDarkMode ? "Dark Mode" : "Light Mode"}
                </div>
              </div>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link
                      to="/settings"
                      className="text-gray-300 hover:text-white"
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-gray-300 hover:text-white"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <LogoutButton onLogout={handleLogout} />
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className="text-gray-300 hover:text-white">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>

        <div id="App" className="">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/registration" element={<RegistrationPage />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateWrapper isLoggedIn={isLoggedIn} authToken={authToken}>
                    <Dashboard authToken={authToken} />
                  </PrivateWrapper>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateWrapper isLoggedIn={isLoggedIn} authToken={authToken}>
                    <Settings authToken={authToken} />
                  </PrivateWrapper>
                }
              />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
