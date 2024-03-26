import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../contexts/user.context';

import NavbarComponent from '../components/Navbar';
import LogMessage from '../components/LogMessage';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Offcanvas from 'react-bootstrap/Offcanvas';


import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Home() {
 //const { logOutUser } = useContext(UserContext);
 //const [response, setResponse] = useState('');

 const videoRef = useRef(null);
 const videoRef2 = useRef(null);
 const streamRef = useRef(null);
 const containerRef = useRef(null);

 const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

 useEffect(() => {
  const container = containerRef.current;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}, []);

 useEffect(() => {
  const getWebcamVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current && videoRef2.current) {
        videoRef.current.srcObject = stream;
        videoRef2.current.srcObject = stream;
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
 /*
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
  }*/
 
 return (
   <>
      <NavbarComponent />
      <Container>
        <h1>Welcome to ISENtinel</h1>
        <Row style={{paddingBottom: '2vh'}}>
          <Col style={{ height: '60vh' }}><video style={{ width: '100%',  height: '100%',  objectFit: 'cover', borderRadius: '8px'}} autoPlay muted ref={videoRef} /></Col>
          <Col style={{ height: '60vh' }}><video style={{ width: '100%',  height: '100%',  objectFit: 'cover', borderRadius: '8px'}} autoPlay muted ref={videoRef2} /></Col>
        </Row>
        <Row>
          <Col>
            <div style={{backgroundColor: 'black', color: 'white', height: '15vh', overflow: 'auto', borderRadius: '8px'}} id='scrollbar' ref={containerRef}>
              <LogMessage message="Event 1" type="alert1" />
              <LogMessage message="Event 2" type="alert2" />
              <LogMessage message="Event 3" type="alert3" />
              <LogMessage message="Event 4" type="alert4" />
              <LogMessage message="Event 5" type="alert5" />
              <LogMessage message="Event 6" type="alert1" />
              <LogMessage message="Event 7" type="alert2" />
              <LogMessage message="Event 8" type="alert3" />
              <LogMessage message="Event 9" type="alert4" />
              <LogMessage message="Event 10" type="alert5" />
            </div>
          </Col>
        </Row>
        <Button variant="primary" onClick={handleShow} style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}>Open Offcanvas</Button>
      </Container>
      
      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
      {/* Offcanvas content goes here */}
      {/* Example content */}
          <p>Offcanvas content</p>
        </Offcanvas.Body>
      </Offcanvas>


     {/*<Button variant="primary" onClick={addEventToBDD}>Add Event to BDD</Button>{' '}
     <Button variant="primary" onClick={logOut}>Logout</Button>{' '}
     <Button variant="primary" onClick={handleClick}>Send Message</Button>
 <p>Server Response: {response}</p>*/}

     {/* Video from aN URL 
     <video className="w-100" autoPlay loop muted>
      <source
        src="https://mdbootstrap.com/img/video/animation-intro.mp4"
        type="video/mp4"
        allowFullScreen
      />
 </video>*/}

    
   </>
 )
}