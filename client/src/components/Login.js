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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send the login data to the server
        try {
            const response = await fetch('http://localhost:2121/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            // Check if login was successful
            if (response.ok) {
                const result = await response.json();

                // Save the token to localStorage or context (if the backend returns a token)
                localStorage.setItem('authToken', result.token);

                // Log for demonstration purposes
                console.log('Logged in successfully:', result);

                // Redirect to the dashboard
                navigate('/dashboard');
            } else {
                const error = await response.json();
                console.error('Failed to log in:', error.message);
                // Here you could set some state to show an error message to the user
            }
        } catch (err) {
            console.error('Network or server error:', err);
            // Here you could set some state to show an error message to the user
        }
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
