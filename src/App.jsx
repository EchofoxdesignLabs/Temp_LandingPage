import React, { useState, useEffect } from 'react';
import './App.css';
import Background from './components/Background/Background';

function App() {
  // Set a fixed progress value as seen in the new design
  const [progress, setProgress] = useState(88.6);
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState('');

  // This useEffect handles the animated favicon
  // useEffect(() => {
  //   const favicon = document.getElementById('favicon');
  //   const frames = [];
  //   const frameCount = 134; 
  //   for(let i = 0; i <= frameCount; i++) {
  //     const paddedIndex = i.toString().padStart(3, '0');
  //     frames.push(`/tile${paddedIndex}.png`);
  //   }
    
  //   let frameIndex = 0;
  //   const animateFavicon = () => {
  //     frameIndex = (frameIndex + 1) % frames.length;
  //     favicon.href = frames[frameIndex];
  //   };

  //   const animationInterval = setInterval(animateFavicon, 40);

  //   return () => clearInterval(animationInterval);
  // },[]);

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
          Your entry into <span className="highlight-bold">Echofox Design Labs</span> is in Stasis
        </h1>
        <p className="subheading">
          Please be on standby... Something sharper is coming up on the horizon
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
