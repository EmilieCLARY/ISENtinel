import { useState, useEffect, useRef } from 'react';

import NavbarComponent from '../components/Navbar';
import LogMessage from '../components/LogMessage';

import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

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
  const [classNames, setClassNames] = useState({});
  const [selectedClasses, setSelectedClasses] = useState({});  
  const [filterText, setFilterText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('success'); // State for alert variant
  const [alertMessage, setAlertMessage] = useState(''); // State for alert message

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/class_names')
      .then(response => response.json())
      .then(data => setClassNames(data))
      .catch(error => console.error('Error fetching class names:', error));
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

  //getWebcamVideo();

  return () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };
}, []);

  const addEventToState = (event) => {
    setEvents(prevEvents => [...prevEvents, event]);
    // Scroll to the bottom of the container when a new event is added.
    setShowAlert(true); // Show alert when a new event is added
    setAlertMessage("The event " + event.message + " has been detected"); // Set alert message
    setAlertVariant('danger');
    
    setTimeout(() => {
      const container = containerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 20);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }

  const handleTMP = () => {
    addEventToState({ message: "Event 11", type: "alert3" });
  }

  const handleCheckboxChange = (event, key) => {
    setSelectedClasses(prevState => {
      const updatedState = { ...prevState };
      updatedState[key] = !prevState[key]; // Toggle the state
      return updatedState;
    });
  };

  /*useEffect(() => {
    console.log(selectedClasses);
  }, [selectedClasses]);*/

  const filteredClassNames = Object.entries(classNames).filter(([key, value]) =>
    value.toLowerCase().includes(filterText.toLowerCase())
  );
 
  const handleSaveChanges = () => {
    // Implement your logic to save changes here
    console.log('Changes saved:', selectedClasses);
    // Create a table with the selected classes (table of int)
    let selectedClassesTable = [];
    for (let key in selectedClasses) {
      if (selectedClasses[key]) {
        selectedClassesTable.push(parseInt(key));
      }
    }
    console.log(selectedClassesTable);
    // Send the updated data to Flask server
    fetch('http://localhost:8000/update_table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedClassesTable }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Table updated successfully:', data);
    })
    .catch(error => {
        console.error('Error updating table:', error);
    });
  };

  return (
    <>
      <NavbarComponent />
      <Container>
      {showAlert && (
        <div  style={{position: 'absolute', width: '30vw', zIndex: '999', left: '35vw'}}>
          <Alert
            variant={alertVariant}
            onClose={() => setShowAlert(false)}
            dismissible
            className="alert-slide"
          >
            {alertMessage}
          </Alert>
        </div>
      )}
        <h1 style={{paddingBottom: '1vh'}}>Welcome to ISENtinel</h1>
        <Row style={{paddingBottom: '2vh'}}>
          <Col style={{ position: 'relative', height: '60vh'}}><Spinner animation="border" role="status" style={{ position: 'absolute', top: '50%', left: '50%', zIndex: '1' }} /><img style={{ position: 'relative', width: '100%',  height: '100%',  objectFit: 'cover', border: '2px solid #ccc', borderRadius: '8px', zIndex: '2'}} src="http://localhost:8000/video_feed" alt="Video Feed" /></Col>
          <Col style={{ position: 'relative', height: '60vh'}}><Spinner animation="border" role="status" style={{ position: 'absolute', top: '50%', left: '50%', zIndex: '1' }} /><img style={{ position: 'relative', width: '100%',  height: '100%',  objectFit: 'cover', border: '2px solid #ccc', borderRadius: '8px', zIndex: '2'}} src="http://localhost:8000/video_feed" alt="Video Feed" /></Col>
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
        <Offcanvas.Body id='scrollbar'>
        <Form.Control
          type="text"
          placeholder="Filter by class name"
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
          style={{ marginBottom: '1vh' }}
        />
        <Button variant="primary" onClick={handleSaveChanges} style={{ marginBottom: '1vh' }}>Save Changes</Button>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Class Name</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {filteredClassNames.map(([key, value], index) => (
            <tr key={key}>
              <td>{index + 1}</td>
              <td>{value}</td>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedClasses[key] || false}
                  onChange={(event) => handleCheckboxChange(event, key)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
        </Offcanvas.Body>
      </Offcanvas>
   </>
 )
}