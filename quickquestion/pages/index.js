import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Home from './Home';
import Login from './Login';
import RegistrationPage from './RegistrationPage';
import Dashboard from './Dashboard';
import LogoutButton from '../components/LogoutButton';
import PrivateWrapper from '../components/PrivateWrapper';
import Link from 'next/link';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedAuthToken = localStorage.getItem('authToken');
    const storedTokenExpiration = localStorage.getItem('tokenExpiration');

    if (storedAuthToken && new Date(storedTokenExpiration) > new Date()) {
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
      router.push('/dashboard'); // Redirect to the dashboard page after login
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
    router.push('/'); // Redirect to the home page after logout
  };

  return (
    <>
      <Head>
        <title>Chat GPT API Generator</title>
      </Head>
      <div className="App">
        <nav className="navbar bg-gray-900 text-white py-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="navbar__logo">
              <Link href="/" className="text-xl font-bold">
                Chat GPT API Generator
              </Link>
            </div>
            <ul className="navbar__menu flex space-x-4">
              {isLoggedIn ? (
                <>
                  <li>
                    <Link href="/dashboard" className="text-gray-300 hover:text-white">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <LogoutButton onLogout={handleLogout} />
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-white">
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
            <>
              <Home />
              <Login onLogin={handleLogin} />
              <RegistrationPage />
              {isLoggedIn && (
                <PrivateWrapper isLoggedIn={isLoggedIn} authToken={authToken}>
                  <Dashboard authToken={authToken} />
                </PrivateWrapper>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
