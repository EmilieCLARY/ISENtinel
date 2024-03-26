//import { Button } from '@mui/material'
import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../contexts/user.context';
import io from 'socket.io-client';
import NavbarComponent from '../components/Navbar';
import Table from 'react-bootstrap/Table';

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
                return "white";
        }
    }


    return (
        <>
        <div onLoad={getAllDegree}>
        <div onLoad={getAllEvents}>
            <NavbarComponent />
            <h1 style={{ marginLeft: '3%', marginTop: '2%' }}>Events</h1>
            <Table striped bordered hover style={{ width: '90%', margin: '0 auto' }} className='mt-5'>
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
                            <td>{event.camera_id}</td>
                            <td>{getDateFromId(event.id)}</td>
                            <td>{getTimeFromId(event.id)}</td>
                            <td>{event.end_time}</td>
                            <td>{event.anomaly_type}</td>
                            <td style={{ backgroundColor: changeColorOfCellDependingOnTheAnomalyLevel(getAnomalyLevelFromAnomalyType(event.anomaly_type)) }}> {getAnomalyLevelFromAnomalyType(event.anomaly_type)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div></div>
        </>
    )
}