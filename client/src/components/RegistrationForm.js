import React, { useState } from 'react';

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make API request to create a new user account
            const response = await fetch('http://localhost:2121/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                // User registration successful, redirect to login page or desired page
                window.location.href = '/login';
            } else {
                // User registration failed, display error message
                setError('Registration failed. Please try again.');
            }
        } catch (error) {
            // Handle any API request errors
            setError('An error occurred during registration');
        }
    };



    return (    
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-4">
            {error && <p className="text-red-500 mb-4">{error}</p>}
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
    );
};

export default RegistrationForm;
