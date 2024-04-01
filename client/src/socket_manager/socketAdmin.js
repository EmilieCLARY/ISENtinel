// Create a custom hook to manage socket connection and event listeners
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocketAdmin = (userId) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const socket = io('http://localhost:5000');

  useEffect(() => {
    const handleIsAdmin = (data) => {
      setIsAdmin(data);
      console.log('Is admin:', data);
    };

    socket.emit('getIsAdmin', userId);
    socket.on('isAdmin', handleIsAdmin);

    return () => {
      socket.off('isAdmin', handleIsAdmin);
    };
  }, [userId, socket]);

  return isAdmin;
};

export default useSocketAdmin;
