import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function AccessibleNavigationAnnouncer() {
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => setMessage(`${document.title}`), 500);
    setTimeout(() => setMessage(''), 1000);
  }, [location]);

  return (
    <div className="visually-hidden" role="status" aria-live="assertive" aria-atomic="true">
      {message}
    </div>
  );
}

export default AccessibleNavigationAnnouncer;
