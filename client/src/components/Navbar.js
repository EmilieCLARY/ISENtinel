import { useContext } from 'react';

import socketAdmin from '../socket_manager/socketAdmin';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import { UserContext } from '../contexts/user.context';
import logo from '../resources/images/logo.png';

import { BsBoxArrowRight } from "react-icons/bs";

import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function NavbarComponent() {
    //console.log('Socket object:', socket); // Check if socket is defined
    const { logOutUser } = useContext(UserContext);
    const {user} = useContext(UserContext);
    const isAdmin = socketAdmin(socket, user.id);
    
    
    // This function is called when the user clicks the "Logout" button.
    const logOut = async () => {
        try {
        // Calling the logOutUser function from the user context.
        const loggedOut = await logOutUser();
        // Now we will refresh the page, and the user will be logged out and
        // redirected to the login page because of the <PrivateRoute /> component.
        if (loggedOut) {
            window.location.reload(true);
            //console.log('Logged out');
        }
        } catch (error) {
        alert(error)
        }
    }
    
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Image src={logo} width="40" height="40" className="d-inline-block align-top" alt="ISENtinel logo" style={{marginRight: '1vw'}}/>
                <Navbar.Brand href="/">ISENtinel</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link style={{fontSize: '18px', marginLeft: '2vw'}} href="/">Home</Nav.Link>
                    <Nav.Link style={{fontSize: '18px', marginLeft: '2vw'}} href="/event">Events</Nav.Link>
                    {isAdmin && <Nav.Link style={{fontSize: '18px', marginLeft: '2vw'}} href="/users">Users Management</Nav.Link>}
                    {isAdmin && <Nav.Link style={{fontSize: '18px', marginLeft: '2vw'}} href="/anomaly">Anomaly Management</Nav.Link>}
                    <Nav.Link style={{fontSize: '18px', marginLeft: '2vw'}} href="/info">Infos</Nav.Link>
                </Nav>
                <Nav className="justify-content-end">
                    <Button variant="info" onClick={logOut}>Logout <BsBoxArrowRight style={{fontSize: '23px'}} /></Button>
                </Nav>
            </Container>
        </Navbar>
    );
}
