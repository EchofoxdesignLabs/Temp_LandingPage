import React, { useState, useEffect } from 'react';
import './App.css';
import Background from './components/Background/Background';
import { int } from 'three/tsl';

function App() {
  const [progress, setProgress] = useState(13);
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(80); // Set to 80% to match the Figma design
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const favicon = document.getElementById('favicon');
    const frames = [];
    const frameCount = 134; // The total number of frames
    for(let i = 0;i<=frameCount;i++)
    {
      const paddedIndex = i.toString().padStart(3, '0');
      frames.push(`/tile${paddedIndex}.png`);
    }
    let frameIndex = 0;
    const animateFavicon = () => {
    frameIndex = (frameIndex + 1) % frames.length;
    favicon.href = frames[frameIndex];
  };

  // The 40ms interval is still good for this many frames
  const animationInterval = setInterval(animateFavicon, 40);

  return () => clearInterval(animationInterval);
  },[]);

  const handleNotifyMe = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Email submitted:', email);
      setNotification(`Thank you! We'll notify you at ${email}.`);
      setEmail('');
      setTimeout(() => setNotification(''), 5000); // Clear message after 5 seconds
    }
  };

  return (
    
    <div className="app-container">
      {/* Ensure your model path is correct. 
        The file 'contour.glb' should be at: public/assets/models/contour.glb
      */}
      
      <Background modelUrl="/aseets/models/contour_optimized.glb" theme="light" />
      <div className="content-wrapper">
        <h1 className="main-heading">
          You've wandered into Echofox <span className="highlight">2.0</span>
        </h1>
        <p className="subheading">
          Something sharper is coming up on the horizon..
        </p>
        <div className="progress-container">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="progress-text">{progress}%</p>
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