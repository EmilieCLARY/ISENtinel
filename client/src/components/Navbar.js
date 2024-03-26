import { useContext } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';

import { UserContext } from '../contexts/user.context';
import logo from '../resources/images/logo.png';

/*import io from 'socket.io-client';

const socket = io('http://localhost:5000');*/

export default function NavbarComponent() {
    const { logOutUser } = useContext(UserContext);
    
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
    
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Image src={logo} width="40" height="40" className="d-inline-block align-top" alt="ISENtinel logo" style={{marginRight: '1vw'}}/>
                <Navbar.Brand href="/">ISENtinel</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/event">Events</Nav.Link>
                </Nav>
                <Nav className="justify-content-end">
                    <Nav.Link onClick={logOut}>Logout</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}