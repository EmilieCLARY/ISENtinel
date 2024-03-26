import { useState, useEffect, useRef } from 'react';

import NavbarComponent from '../components/Navbar';
import LogMessage from '../components/LogMessage';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { BsChevronDoubleLeft } from "react-icons/bs";


// import io from 'socket.io-client';

//const socket = io('http://localhost:5000');

export default function Home() {

  const videoRef = useRef(null);
  const videoRef2 = useRef(null);
  const streamRef = useRef(null);
  const containerRef = useRef(null);

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [events, setEvents] = useState([]);

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

  const addEventToState = (event) => {
    setEvents(prevEvents => [...prevEvents, event]);
    // Scroll to the bottom of the container when a new event is added.
    setTimeout(() => {
      const container = containerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
  }, 20);
  }

  const handleTMP = () => {
    addEventToState({ message: "Event 11", type: "alert1" });
  }
 
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

              {events.map((event, index) => (
                <LogMessage key={index} message={event.message} type={event.type} />
              ))}
            </div>
          </Col>
        </Row>
        <Button variant="dark" onClick={handleShow} style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}><BsChevronDoubleLeft /></Button>
      </Container>

      <Button variant="primary" onClick={handleTMP}>Add event</Button>

      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Modify your preferences</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>Offcanvas content</p>
        </Offcanvas.Body>
      </Offcanvas>

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