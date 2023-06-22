import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../index.css"; // Update the path to src/index.css

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Implement login submission logic here
    // Example: assuming authentication is successful
    const user = { email, password };
    console.log("Logged in user:", user);

    // Redirect to a different page (e.g., dashboard)
    navigate("/dashboard");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            Email:
            <input
              className="border border-gray-300 px-3 py-2 rounded-md w-full"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
          </label>
          <label className="block mb-4">
            Password:
            <input
              className="border border-gray-300 px-3 py-2 rounded-md w-full"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="mt-4">
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
