import React from "react";

import NavbarComponent from '../components/Navbar';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

import '../style/info.css';

export default function Info() {
    return (
        <>
            <NavbarComponent />
            <Container>            
                <Row>
                    <Col>
                        <h1>Information about the App</h1>
                        <p>This app is a project for the ISEN Lille students. It is a video surveillance system that uses a webcam to detect and track objects. The app is built using React, Node.js, and OpenCV. The app is capable of detecting and tracking objects in real-time.</p>
                        <p>ISENtinel is a project that aims to provide a video surveillance system that can detect and track objects in real-time. The app uses a webcam to capture video frames, and then uses OpenCV to process the frames and detect objects. The app can detect and track objects such as people, cars, and animals. The app can also generate alerts when objects are detected.</p>
                        <p>The app can also generate video clips of detected objects. The video clips are stored in the server and can be viewed in the Event page.</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>Team presentation</h2>
                        <p>The ISENtinel team is composed of 6 students from ISEN Lille :</p>
                        <ListGroup className="custom-list">
                            <ListGroup.Item>
                                <span className="name">Théodore BONDON</span>
                                <span className="info"> - M1 Big Data</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span className="name">Emilie CLARY</span>
                                <span className="info"> - M1 Cybersecurity</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span className="name">Gabin DIETSCH</span>
                                <span className="info"> - M1 Cybersecurity</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span className="name">Nicolas GROUSSEAU</span>
                                <span className="info"> - M1 Big Data</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span className="name">Alexis MALLET</span>
                                <span className="info"> - M1 Software Development</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span className="name">Antoine VANBERTEN</span>
                                <span className="info"> - M1 Cybersecurity</span>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </>
    );
}