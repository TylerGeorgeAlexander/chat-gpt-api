import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './components/Login';
import RegistrationPage from './pages/RegistrationPage';
import Dashboard from './pages/Dashboard';
import LogoutButton from './components/LogoutButton';
import PrivateWrapper from './components/PrivateWrapper';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuthToken = localStorage.getItem('authToken');
    const storedTokenExpiration = localStorage.getItem('tokenExpiration');

    if (storedAuthToken && storedTokenExpiration && new Date(storedTokenExpiration) > new Date()) {
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
      const decodedToken = JSON.parse(atob(authTokenFromBackend.split('.')[1]));
      const expirationTime = new Date(decodedToken.exp * 1000);

      localStorage.setItem('authToken', authTokenFromBackend);
      localStorage.setItem('tokenExpiration', expirationTime.toISOString());

      setIsLoggedIn(true);
      setAuthToken(authTokenFromBackend);
      setTokenExpiration(expirationTime.toISOString());
    } catch (error) {
      console.error('Error handling login:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    setIsLoggedIn(false);
    setAuthToken('');
    setTokenExpiration(null);
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
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
