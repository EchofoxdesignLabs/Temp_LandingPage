// src/components/NotifyForm/email.jsx

import React, { useState, useEffect } from 'react';
import styles from './styles/email.module.css'; // Uses the same CSS module you provided

const NotifyForm = () => {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  // --- Get keys from environment variables ---
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateIDToOwner = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_OWNER;
  const templateIDToUser = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_USER;

  // EmailJS SDK loading logic (no changes here)
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;

    script.onload = () => {
      window.emailjs.init(publicKey);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Form submission logic (no changes here)
  const handleNotifyMe = (e) => {
    e.preventDefault();
    if (!email) {
      setNotification({ message: 'Please enter a valid email.', type: 'error' });
      return;
    }
    setIsLoading(true);

    const emailjs = window.emailjs;
    if (!emailjs) {
      setIsLoading(false);
      return;
    }

    

    const templateParams = {
      user_email: email,
    };

    Promise.all([
      emailjs.send(serviceID, templateIDToOwner, templateParams),
      emailjs.send(serviceID, templateIDToUser, templateParams)
    ])
    .then(() => {
      setNotification({ message: `Success! A confirmation was sent to ${email}.`, type: 'success' });
      setEmail('');
    })
    .catch((err) => {
      setNotification({ message: 'Oops! Something went wrong.', type: 'error' });
    })
    .finally(() => {
      setIsLoading(false);
      setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    });
  };

  // The JSX is updated to use the original text and tags
  return (
    <>
    <div className={styles.formWrapper}>
      <p className={styles.formLabel}>Get notified when we launch!</p>
      <form onSubmit={handleNotifyMe} className={styles.formContainer}>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="enter your email address"
          required
          className={styles.emailInput}
          disabled={isLoading}
        />
        <button type="submit" className={styles.notifyButton} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'notify me'}
        </button>
      </form>
      {notification.message && 
        <p className={`${styles.notificationMessage} ${styles[notification.type]}`}>
          {notification.message}
        </p>
      }
    </div>
    </>
  );
};

export default NotifyForm;