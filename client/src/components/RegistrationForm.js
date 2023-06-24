import React, { useState } from 'react';
import { Link } from "react-router-dom";
import logo from '../../src/logo.svg'; // TODO: Update this path to where your logo is stored

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:2121/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                window.location.href = '/login';
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (error) {
            setError('An error occurred during registration');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-lg shadow p-8 max-w-sm w-full">
                <div className="mb-4 text-center">
                    <img src={logo} alt="App Logo" className="w-24 mx-auto" /> {/* Logo area */}
                </div>
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                {error && (
                    <div className="bg-red-100 text-red-700 rounded-md p-2 mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <label className="block mb-4">
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            className="border border-gray-300 px-3 py-2 rounded-md w-full"
                        />
                    </label>
                    <label className="block mb-4">
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="border border-gray-300 px-3 py-2 rounded-md w-full"
                        />
                    </label>
                    <label className="block mb-4">
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="border border-gray-300 px-3 py-2 rounded-md w-full"
                        />
                    </label>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegistrationForm;
