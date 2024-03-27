//import { Button } from '@mui/material'
import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../contexts/user.context';

import io from 'socket.io-client';

import NavbarComponent from '../components/Navbar';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import { BsCameraVideoFill, BsEyeFill, BsArrowRight} from "react-icons/bs";

import gabinKidnapping from '../resources/images/GabinKidnapping.png';

const socket = io('http://localhost:5000');

export default function Event(){
    const { logOutUser } = useContext(UserContext);
    const [table_event, setTableEvent] = useState([]);
    const [table_degree, setTableDegree] = useState([]);

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


    const getAllEvents = () => {
        console.log("Get all events");
        socket.emit('getAllEvents');
    }

    const getAllDegree = () => {
        console.log("Get all degree");
        socket.emit('getTableOfAnomalyDegree');
    }

    socket.on('allEvents', (data) => {
        setTableEvent(data);
    });

    socket.on('allDegree', (data) => {
        setTableDegree(data);
        //console.log("Table degré socket", data);
    });

    function getDateFromId(id) {
        // Concatenate the date parts with '-' separator
        return(id.substring(0, 4) + '-' + id.substring(4, 6) + '-' + id.substring(6, 8));
    }

    function getTimeFromId(id) {
        // Concatenate the time parts with ':' separator
        return(id.substring(9, 11) + ':' + id.substring(11, 13) + ':' + id.substring(13, 15));
    }

    function getAnomalyLevelFromAnomalyType(anomaly_type) {
        //console.log("Table Degree Front :", table_degree);
        for (let i=0; i<table_degree.length; i+=1){

            if (table_degree[i].name === anomaly_type) {
                console.log("Trouvé :", anomaly_type, "est niveau", table_degree[i].degree);
                return table_degree[i].degree;
            }
        }
        
        //console.log("Anomaly type not found");
        return "Anomaly type not found";
    }

    function changeColorOfCellDependingOnTheAnomalyLevel(anomaly_level){ 
        // Anomaly level is an integer between 0 and 5
        // 1: low anomaly
        // 2: medium anomaly
        // 3: high anomaly
        // 4: medium-high anomaly
        // 5: critical anomaly

        switch(anomaly_level){
            case 1:
                return "red";
            case 2:
                return "rgb(255, 68, 0)";
            case 3:
                return "rgb(255, 136, 0)";
            case 4:
                return "rgb(255, 247, 0)";
            case 5:
                return "rgb(208, 255, 0)";
            default:
                return "rgb(0, 123, 255)";
        }
    }


    return (
        <>
        <div onLoad={getAllDegree}>
        <div onLoad={getAllEvents}>
            <NavbarComponent />
            <Container >
                <h1>Events</h1>
                <Row xs={1} md={2} lg={3} className="g-5">
                    {table_event.map((event, index) => (
                        <Col key={index}>
                            <Card style={{borderWidth: '3px' ,borderColor: changeColorOfCellDependingOnTheAnomalyLevel(getAnomalyLevelFromAnomalyType(event.anomaly_type))}}>
                                <Card.Header style={{fontWeight: 'bold'}}>Event {event.id}</Card.Header>
                                <Card.Body>
                                    <div>
                                        <Row style={{marginInline: '0.2vw'}}>
                                            <Col>
                                                Date: {getDateFromId(event.id)}
                                            </Col>
                                            <Col xs lg='2'>
                                                <BsCameraVideoFill /> {event.camera_id}
                                            </Col>
                                        </Row>
                                    </div>
                                    <div>
                                        <Row style={{marginInline: '0.2vw'}}>
                                            <Col>
                                                From {getTimeFromId(event.id)} <BsArrowRight /> {event.end_time}
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center"> {/* Center align the anomaly information, image, and button */}
                                        <Row style={{ marginInline: '0.2vw' }}>
                                            <Col>
                                                <div className="d-flex justify-content-center"> {/* Center align the anomaly information */}
                                                    Anomaly Detected: {event.anomaly_type}
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row style={{ marginInline: '0.2vw' }}>
                                            <Col>
                                                <div className="d-flex justify-content-center"> {/* Center align the image */}
                                                    <Image src={gabinKidnapping} style={{ width: '80%', height: '100%', borderRadius: '8px' }} />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row style={{ marginInline: '0.2vw' }}>
                                            <Col>
                                            <div className="d-flex justify-content-center" style={{marginTop: '1vh'}}>
                                                <Button variant="primary">Clip <BsEyeFill style={{ fontSize: '20px' }} /></Button>
                                            </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div></div>
        </>
    )
}