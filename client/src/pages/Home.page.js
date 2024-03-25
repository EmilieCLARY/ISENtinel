//import { Button } from '@mui/material'
import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../contexts/user.context';


import Button from 'react-bootstrap/Button';

import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Home() {
 const { logOutUser } = useContext(UserContext);
 const [response, setResponse] = useState('');

 const videoRef = useRef(null);
  const streamRef = useRef(null);

 useEffect(() => {
  const getWebcamVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream; // Store stream reference for cleanup
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  getWebcamVideo();

  return () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };
}, []);
 
 // This function is called when the user clicks the "Logout" button.
 const logOut = async () => {
   try {
     // Calling the logOutUser function from the user context.
     const loggedOut = await logOutUser();
     // Now we will refresh the page, and the user will be logged out and
     // redirected to the login page because of the <PrivateRoute /> component.
     if (loggedOut) {
       window.location.reload(true);
     }
   } catch (error) {
     alert(error)
   }
 }

 const handleClick = () => {
    // Emit a message to the server when the user clicks the button.
    socket.emit('message', 'Hello from the client!');
  }

  // Listen for the server's response
  socket.on('message received', (msg) => {
    setResponse(msg);
  });

  const addEventToBDD = (id, end_time, anomaly_type, camera_id, path) => {
    // Emit an event to the server when the user clicks the button.
    socket.emit('addEventToBDD', "oui", "string", "string", 9, "string");
  }
 
 return (
   <>
      <h1>Welcome to ISENtinel</h1>
      <p>You are now logged in!</p>

     <Button variant="primary" onClick={addEventToBDD}>Add Event to BDD</Button>{' '}
     <Button variant="primary" onClick={logOut}>Logout</Button>{' '}
     <Button variant="primary" onClick={handleClick}>Send Message</Button>
     <p>Server Response: {response}</p>

     {/* Video from aN URL 
     <video className="w-100" autoPlay loop muted>
      <source
        src="https://mdbootstrap.com/img/video/animation-intro.mp4"
        type="video/mp4"
        allowFullScreen
      />
 </video>*/}

    <video className="w-50" autoPlay muted ref={videoRef} />
   </>
 )
}