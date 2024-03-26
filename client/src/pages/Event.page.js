//import { Button } from '@mui/material'
import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../contexts/user.context';
import Button from 'react-bootstrap/Button';
import io from 'socket.io-client';
import NavbarComponent from '../components/Navbar';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

const socket = io('http://localhost:5000');

export default function Event(){
    const { logOutUser } = useContext(UserContext);
    const [table_event, setTableEvent] = useState([]);

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
        socket.emit('getAllEvents');
    }

    socket.on('allEvents', (data) => {
        setTableEvent(data);
    });

    return (
        <>
        <div onLoad={getAllEvents}>
            <NavbarComponent />
            <h1>Event</h1>
            <Button onClick={logOut}>Logout</Button>
            {/*<Button onClick={getAllEvents}>Get All Events</Button>*/}
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Camera Number</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Anomaly Type</th>
                        <th>Anomaly Level</th>
                    </tr>
                </thead>
                <tbody>
                    {table_event.map((event, index) => (
                        <tr key={index}>
                            <td>{event.id}</td>
                            <td>{event.end_time}</td>
                            <td>{event.anomaly_type}</td>
                            <td>{event.camera_id}</td>
                            <td>{event.end_time}</td>
                            <td>{event.id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    )
}