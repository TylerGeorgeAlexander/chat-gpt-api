import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './components/Login';
import RegistrationPage from './pages/RegistrationPage';
import Dashboard from './pages/Dashboard'; // Import the Dashboard component

function App() {
  return (
    <Router>
      <div className="App">
        <h1 className="text-3xl font-bold underline m-4">Chat GPT API Generator</h1>

        {/* Define your routes here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
        </Routes>

      </div>
    </Router>
  );
}

export default App;
