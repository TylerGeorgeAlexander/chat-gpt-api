import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './components/Login';
import RegistrationPage from './pages/RegistrationPage';
import Dashboard from './pages/Dashboard';
import LogoutButton from './components/LogoutButton'; // Import the LogoutButton component
import PrivateWrapper from './components/PrivateWrapper'; // Import the PrivateWrapper component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (authTokenFromBackend) => {
    localStorage.setItem('authToken', authTokenFromBackend);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar bg-gray-900 text-white py-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="navbar__logo">
              <Link to="/" className="text-xl font-bold">
                Chat GPT API Generator
              </Link>
            </div>
            <ul className="navbar__menu flex space-x-4">
              {isLoggedIn ? (
                <>
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
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>

        <div className="container mx-auto">
          {/* Define your routes here */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateWrapper isLoggedIn={isLoggedIn}>
                  <Dashboard />
                </PrivateWrapper>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
