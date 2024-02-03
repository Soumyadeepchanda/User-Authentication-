import React, { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { app } from './firebase';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

const auth = getAuth(app);

function LoginPage() {
  // Define your login code here
  return (
    <div className="LoginPage">
      <h2>Login</h2>
      {/* Your login form and logic */}
    </div>
  );
}

function RegistrationPage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleRegistration = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setRedirectToLogin(true);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('User already registered. Please login.');
      } else {
        setError(error.message);
      }
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="RegistrationPage">
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegistration}>Register</button>
      {error && error !== 'User already registered. Please login.' && (
        <p style={{ color: 'red' }}>{error}</p>
      )}
      {/* Add the following message for email-already-in-use error */}
      {error === 'User already registered. Please login.' && (
        <p style={{ color: 'blue' }}>{error}</p>
      )}
    </div>
  );
}
function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      // Call your server-side logout endpoint
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to My Full-Stack MERN Project</h1>
          {user ? (
            <>
              <p>Hello, {user.displayName}!</p>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={handleLogin}>Login with Google</button>
              {!user && (
                <Link to="/register" style={{ marginLeft: '10px' }}>
                  Register
                </Link>
              )}
            </>
          )}
        </header>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;