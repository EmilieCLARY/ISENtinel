//import { Button } from '@mui/material'
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/user.context';

import io from 'socket.io-client';

import NavbarComponent from '../components/Navbar';
import ClipModal from '../components/ClipModal';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { BsCameraVideoFill, BsEyeFill, BsArrowRight, BsChevronDoubleDown , BsChevronDoubleUp } from "react-icons/bs";

const socket = io('http://localhost:5000');

export default function Event(){
    const [table_event, setTableEvent] = useState([]);
    const [table_degree, setTableDegree] = useState([]);
    const [tableFilteredAndSorted, setTableFilteredAndSorted] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrderAsc, setSortOrderAsc] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);


    useEffect(() => {
        getAllEvents();
        getAllDegree();
    }, []);

    useEffect(() => {
        // Update tableFilteredAndSorted whenever table_event, search, sortBy, or sortOrder changes
        filterAndSortTable();
    }, [table_event, search, sortBy, sortOrderAsc]);

    const getAllEvents = () => {
        //console.log("Get all events");
        socket.emit('getAllEvents');
    }

    const getAllDegree = () => {
        //console.log("Get all degree");
        socket.emit('getTableOfAnomalyDegree');
    }

    const getVideoFromFilepath = (filepath) => {
        console.log("Get video from filepath");
        socket.emit('getVideoFromFilePath', filepath);
    }
    
    socket.on('allEvents', (data) => {
        setTableEvent(data);
    });

    socket.on('allDegree', (data) => {
        setTableDegree(data);
        //console.log("Table degré socket", data);
    });

    socket.on('videoFromPath', (data) => {
        console.log("Video from path");
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
                //console.log("Trouvé :", anomaly_type, "est niveau", table_degree[i].degree);
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
            case 5:
                return "red";
            case 4:
                return "rgb(255, 68, 0)";
            case 3:
                return "rgb(255, 136, 0)";
            case 2:
                return "rgb(255, 247, 0)";
            case 1:
                return "rgb(208, 255, 0)";
            default:
                return "rgb(0, 123, 255)";
        }
    }

    function getPathFromId(id) { // id is a string of the form 'YYYYMMDD_HHMMSS', file path is a string of the form '../resources/videos/YYYYMMDD/YYYYYMMDD_HHMMSS.mp4'
        let standard_path = "client/public/videos/";
        let date = id.substring(0, 8);
        let file_path = standard_path + date + '/' + id + '.avi';
        return file_path;
    }

    function filterAndSortTable() {
        //console.log("Filter and sort table");
        // Filter based on search query
        let filteredTable = table_event.filter(event =>
            event.anomaly_type.toLowerCase().includes(search.toLowerCase())
        );

         // Sort filteredTable based on sortBy and sortOrder
         filteredTable.sort((a, b) => {
            let aValue, bValue;

            if (sortBy === "camera") {
                aValue = a.camera_id;
                bValue = b.camera_id;
            } else if (sortBy === "date") {
                aValue = a.id;
                bValue = b.id;
            } else if (sortBy === "anomaly") {
                aValue = a.anomaly_type;
                bValue = b.anomaly_type;
            } else if (sortBy === "anomalyLevel") {
                aValue = getAnomalyLevelFromAnomalyType(a.anomaly_type);
                bValue = getAnomalyLevelFromAnomalyType(b.anomaly_type);
            }
            else {
                return 0;
            }

            // For anomaly level, you may want to adjust the comparison logic based on your requirement
            if (sortBy === "anomalyLevel") {
                return sortOrderAsc ? aValue - bValue : bValue - aValue;
            } else if (sortBy === "camera"){
                return sortOrderAsc ? aValue - bValue : bValue - aValue;
            } 
            else {
                return sortOrderAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
        });

        setTableFilteredAndSorted(filteredTable);
    }

    function handleChangeSearch(event) {
        setSearch(event.target.value);
    }

    function handleChangeSortBy(event) {
        setSortBy(event.target.value);
    }

    function toggleSortOrder() {
        setSortOrderAsc(!sortOrderAsc);
    }

    // Function to handle opening the modal and set the selected event
    const handleOpenModal = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    // Dir in date folder called thumbnails and save the thumbnail there with the same name as the video _thumbnail.jpg
    function getThumbnailPathFromId(id) {
        let standard_path = "videos/";
        let date = id.substring(0, 8);
        let file_path = standard_path + date + '/thumbnails/' + id + '_thumbnail.jpg';
        console.log("Thumbnail path: ", file_path);
        return file_path;
    }

    return (
        <>
            <NavbarComponent />
            <Container style={{marginBottom: '10vh'}}>
                {/*<video controls style={{ width: '100%' }}>
                <source src='client/src/resources/videos/20240328/20240328_110653.mp4' type="video/mp4" />
                Your browser does not support the video tag.
                </video>*/}
                <h1>Events</h1>
                <Form style={{marginInline: '20vw'}}>
                    <InputGroup className="mb-1" controlid="formSearch">
                        <InputGroup.Text id="basic-addon1">Search detected object</InputGroup.Text>
                        <Form.Label></Form.Label>
                        <Form.Control type="text" placeholder="Enter event name" value={search} onChange={handleChangeSearch} />
                    </InputGroup>
                    <InputGroup className="mb-2" controlid="formSortBy">
                        <InputGroup.Text id="basic-addon1">Sort by</InputGroup.Text>
                        <Form.Select onChange={handleChangeSortBy}>                            
                            <option value="date">Date</option>
                            <option value="camera">Camera</option>
                            <option value="anomaly">Anomaly Type</option>
                            <option value="anomalyLevel">Anomaly Level</option>
                        </Form.Select>
                        <Button variant="primary" onClick={toggleSortOrder}>
                            {sortOrderAsc ? ("Desc " &&  <BsChevronDoubleDown /> ): "Asc " && <BsChevronDoubleUp />}
                        </Button>
                    </InputGroup>                    
                </Form>
                <Row xs={1} md={2} lg={3} className="g-5">
                    {tableFilteredAndSorted.map((event, index) => (
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
                                                <div className="d-flex justify-content-center"> {/* Center align the video preview */}
                                                    {/*<video controls width="320" height="180" poster={gabinKidnapping}>
                                                        <source src={`${getPathFromId(event.id)}`} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                    </video>*/}
                                                    <Image src={getThumbnailPathFromId(event.id)} style={{ width: '80%', height: '100%', borderRadius: '8px' }} />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row style={{ marginInline: '0.2vw' }}>
                                            <Col>
                                            <div className="d-flex justify-content-center" style={{marginTop: '1vh'}}>
                                                <Button variant="primary" onClick={() => handleOpenModal(event)}>Clip <BsEyeFill style={{ fontSize: '20px' }} /></Button>
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
            <ClipModal 
                show={showModal} 
                onHide={handleCloseModal} 
                date={selectedEvent ? getDateFromId(selectedEvent.id) : ''} 
                time={selectedEvent ? getTimeFromId(selectedEvent.id) : ''} 
            />
        </>
    )
}