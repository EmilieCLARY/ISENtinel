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
import Alert from 'react-bootstrap/Alert';

import { BsFillPersonCheckFill, BsFillPersonDashFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

import '../style/userspage.css';

export default function Users({socket}) {
    const {user, addUser, emailPasswordSignup} = useContext(UserContext);
    const isAdmin = socketAdmin(socket, user.id);
    const [table_user, setTableUser] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const onFormInputChange = (event) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };
    
    const getAllUsers = () => {
        socket.emit('getAllUsers');
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    socket.on('allUsers', (table_user_) => {
        setTableUser(table_user_);
        //console.log(table_user);
    });

    const toggleAdmin = (id) => {
        //console.log('Toggle admin :', id);
        socket.emit('toggleAdmin', id);
    }

    const handleRegister = () => {
        //console.log('Register user');
        // Show the modal for register user
        setShowModal(true);
    }

    const onSubmit = async () => {
        try {
            const user = await addUser(form.email, form.password);
            if (user) {
               setShowModal(false);
               // Clear the form
               setForm({
                   email: "",
                   password: ""
               });

                // Show the alert for 5 seconds
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 5000);
            }
        } catch (error) {
            alert(error);
        }
    }
    if (isAdmin) {
        return (
            <>
                {/* Modal for register user */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header>
                        <Modal.Title>Register a user</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" name='email' value={form.email} onChange={onFormInputChange}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <InputGroup>
                                    <Form.Control type={showPassword ? "text" : "password"} placeholder="Password" name='password' value={form.password} onChange={onFormInputChange}/>
                                    <Button variant="outline-secondary" onClick={() => setShowPassword(prevState => !prevState)}>
                                        {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                        <Button variant="primary" onClick={onSubmit}>Register</Button>
                    </Modal.Footer>
                </Modal>
                <NavbarComponent />
                {/* Alert when register is pressed */}
                <div  style={{position: 'absolute', width: '50vw', zIndex: '999', left: '25vw', top: '10vh'}}>
                    <Alert show={showAlert} variant="success" onClose={() => setShowAlert(false)} dismissible>
                        <Alert.Heading>User registered</Alert.Heading>
                        The user has been registered successfully !
                        In order to see it in the page, wait for him to log in for the first time.
                    </Alert>
                </div>
                <Container>
                    <h1>Users Management</h1>
                    <p>Here you can manage the users of the application.</p>

                    <Button onClick={handleRegister} style={{ margin: 'auto', display: 'block', marginBottom: '10px' }} variant="primary">Register a user</Button>

                    <ListGroup className="custom-list-users">
                        {table_user.map((user) => (
                            <ListGroup.Item key={user.user_id} >
                                <h4>{user.email}</h4>
                                <p>ID: {user.user_id}</p>
                                <Row>
                                    <Col>
                                        <p>Admin : {user.isAdmin ? <BsFillPersonCheckFill style={{fontSize: '23px'}}/> : <BsFillPersonDashFill style={{fontSize: '23px'}}/>}</p>
                                    </Col>
                                    <Col>
                                        {!user.isAdmin ? <Button onClick={() => toggleAdmin(user.user_id)} variant="danger">Make admin</Button> : <Button onClick={() => toggleAdmin(user.user_id)}  variant="success">Remove admin</Button>}
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