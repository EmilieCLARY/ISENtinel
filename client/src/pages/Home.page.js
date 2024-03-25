import { Button } from '@mui/material'
import { useContext, useEffect, useState  } from 'react';
import { UserContext } from '../contexts/user.context';

import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Home() {
 const { logOutUser } = useContext(UserContext);
 const [response, setResponse] = useState('');
 
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
 
 return (
   <>
     <h1>Welcome to ISENtinel</h1>
     <Button variant="contained" onClick={logOut}>Logout</Button>
     <Button variant="contained" onClick={handleClick}>Send Message</Button>
     <p>Server Response: {response}</p>
   </>
 )
}