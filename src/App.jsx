import React, { useState, useEffect } from 'react';
import './App.css';
import Background from './components/Background/Background';

function App() {
  // Set a fixed progress value as seen in the new design
  const [progress, setProgress] = useState(88.6);
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState('');

  const handleNotifyMe = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Email submitted:', email);
      setNotification(`Thank you! We'll notify you at ${email}.`);
      setEmail('');
      setTimeout(() => setNotification(''), 5000);
    }
  };

  return (
    <div className="app-container">
      <Background modelUrl="/aseets/models/contour_optimized.glb" theme="light" />
      
      <div className="content-wrapper">
        <h1 className="main-heading">
          Welcome to <span className="highlight-bold">Echofox Design Labs</span>
        </h1>
        <p className="subheading">
          Level up is in progress… the Reveal is near
        </p>
        
        {/* --- Updated Progress Bar Structure --- */}
        <div className="progress-container">
          <p className="progress-text">{progress}%</p>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
            {/* The new animated dots, positioned dynamically */}
            <div className="loader-dots" style={{ left: `${progress}%` }}>
              <div className="dot dot-1"></div>
              <div className="dot dot-2"></div>
              <div className="dot dot-3"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-wrapper">
        <p className="form-label">Get notified when we launch!</p>
        <form onSubmit={handleNotifyMe} className="form-container">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="enter your email address"
            required
            className="email-input"
          />
          <button type="submit" className="notify-button">
            notify me
          </button>
        </form>
        {notification && <p className="notification-message">{notification}</p>}
      </div>
    </div>
  );
}

export default App;
