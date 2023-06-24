import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css"; // Update the path to src/index.css
import logo from '../../src/logo.svg'; // TODO: Update this path to where your logo is stored

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State variable for error message
  const [isLoggingIn, setIsLoggingIn] = useState(false); // State variable for login process
  const [loginTimer, setLoginTimer] = useState(null); // State variable for login timer
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggingIn) {
      // Start the login timer
      const timer = setTimeout(() => {
        handleLogin();
      }, 3000); // Delay for 3 seconds

      // Save the timer reference in the state
      setLoginTimer(timer);
    }

    return () => {
      // Clear the login timer when the component unmounts
      clearTimeout(loginTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggingIn]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    // Start the login process
    setIsLoggingIn(true);
  };

  const handleLogin = async () => {
    // Send the login data to the server
    try {
      const response = await fetch("http://localhost:2121/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if login was successful
      if (response.ok) {
        const result = await response.json();

        // Call the onLogin callback with the received authToken
        onLogin(result.authToken);

        // Log for demonstration purposes
        console.log("Logged in successfully:", result);

        // Redirect to the dashboard
        navigate("/dashboard");
      } else {
        const error = await response.json();
        setError(error.message); // Set the error message state
      }
    } catch (err) {
      console.error("Network or server error:", err);
      setError("An error occurred during login. Please try again."); // Set the error message state
    } finally {
      setIsLoggingIn(false); // Stop the login process
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@example.com");
    setPassword("password");

    // Start the login process
    setIsLoggingIn(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 max-w-sm w-full">
        <div className="mb-4 text-center">
          <img src={logo} alt="App Logo" className="w-24 mx-auto" /> {/* Logo area */}
        </div>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && (
          <div className="bg-red-100 text-red-700 rounded-md p-2 mb-4">
            {error}
          </div>
        )} {/* Display the error message */}
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            Email:
            <input
              className="border border-gray-300 px-3 py-2 rounded-md w-full"
              type="email"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoggingIn} // Disable the input during login process
            />
          </label>
          <label className="block mb-4">
            Password:
            <input
              className="border border-gray-300 px-3 py-2 rounded-md w-full"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={isLoggingIn} // Disable the input during login process
            />
          </label>
          {isLoggingIn ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2" />
              <p className="text-blue-500">Logging In...</p>
            </div>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              type="submit"
            >
              Login
            </button>
          )}
          {!isLoggingIn && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
              type="button"
              onClick={handleDemoLogin}
            >
              Demo Login
            </button>
          )}
        </form>
        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/registration" className="text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
