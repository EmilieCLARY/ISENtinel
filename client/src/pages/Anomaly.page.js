import { useState, useEffect, useRef, useContext} from 'react';

import socketAdmin from '../socket_manager/socketAdmin';
import { UserContext } from '../contexts/user.context';

import NavbarComponent from '../components/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { BsChevronDoubleDown , BsChevronDoubleUp } from "react-icons/bs";

import '../style/anomalypage.css';

export default function Anomaly({socket}) {
    const {user} = useContext(UserContext);
    const isAdmin = socketAdmin(socket, user.id);
    const [table_anomalies, setTableAnomalies] = useState([]);
    const [tableFilteredAndSorted, setTableFilteredAndSorted] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("degree");
    const [sortOrderAsc, setSortOrderAsc] = useState(true);

    const getAllAnomalies = () => {
        socket.emit('getAllAnomalies');
    }

    useEffect(() => {
        getAllAnomalies();
    }, []);

    socket.on('allAnomalies', (table_anomalies_) => {
        setTableAnomalies(table_anomalies_);
        //console.log('Table anomalies:', table_anomalies);
    });

    function handleChangeSearch(event) {
        setSearch(event.target.value);
    }

    function handleChangeSortBy(event) {
        setSortBy(event.target.value);
    }

    function toggleSortOrder() {
        setSortOrderAsc(!sortOrderAsc);
    }

    function filterAndSortTable() {
        //console.log('Filter and sort table');
        if(table_anomalies.length === 0) {
            return;
        }

        let tableFiltered = table_anomalies.filter((anomaly) => {
            return anomaly.name.toLowerCase().includes(search.toLowerCase());
        });

        tableFiltered = tableFiltered.sort((a, b) => {
            let aValue, bValue;
            if (sortBy === "degree") {
                aValue = a.degree;
                bValue = b.degree;
            } else if (sortBy === "name") {
                aValue = a.name;
                bValue = b.name;
            }

            if (aValue < bValue) {
                return sortOrderAsc ? -1 : 1;
            } else if (aValue > bValue) {
                return sortOrderAsc ? 1 : -1;
            } else {
                return 0;
            }
        });

        setTableFilteredAndSorted(tableFiltered);
    }

    useEffect(() => {
        filterAndSortTable();
    }, [table_anomalies, search, sortBy, sortOrderAsc]);

    function handleDegreeChange(event, name) {
        socket.emit('changeAnomalyDegree', name, parseInt(event.target.value));
    }



    if (isAdmin) {
        return (
            <>
                <NavbarComponent />
                <Container>
                    <h1>Anomaly Management</h1>
                    <p>Here you can manage anomalies and change their degree.</p>

                    <Form style={{marginInline: '20vw'}}>
                        <InputGroup className="mb-1" controlid="formSearch">
                            <InputGroup.Text id="basic-addon1">Search an anomaly</InputGroup.Text>
                            <Form.Label></Form.Label>
                            <Form.Control type="text" placeholder="Enter anomaly name" value={search} onChange={handleChangeSearch} />
                        </InputGroup>
                        <InputGroup className="mb-2" controlid="formSortBy">
                            <InputGroup.Text id="basic-addon1">Sort by</InputGroup.Text>
                            <Form.Select onChange={handleChangeSortBy}> 
                                <option value="degree">Degree</option>                           
                                <option value="name">Name</option>
                            </Form.Select>
                            <Button variant="primary" onClick={toggleSortOrder}>
                                {sortOrderAsc ? ("Desc " &&  <BsChevronDoubleDown /> ): "Asc " && <BsChevronDoubleUp />}
                            </Button>
                        </InputGroup>                    
                    </Form>

                    <ListGroup className="custom-list-group">
                        <ListGroup.Item variant="primary" className="custom-list-group-item-heading">
                            <Row>
                                <Col>Name</Col>
                                <Col>Degree</Col>
                            </Row>
                        </ListGroup.Item>
                        {tableFilteredAndSorted.map((anomaly, index) => (
                            <ListGroup.Item key={index} className="custom-list-group-item">
                                <Row className="custom-list-group-item-content">
                                    <Col>{anomaly.name}</Col>
                                    {/* Add a form select to change the degree */}
                                    <Col>
                                        <Form.Select value={anomaly.degree} onChange={(event) => handleDegreeChange(event, anomaly.name)}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Container>
            </>
        );
    }
    else {
        return (
            <>
                <NavbarComponent />
                <Container>
                    <h1>Unauthorized Access</h1>
                    <p>You are not authorized to access this page.</p>
                    <p>Please contact your administrator for more information.</p>

                    <Button href="/" variant="primary">Go back to Home</Button>
                </Container>
                
            </>
        );
    }
    
}