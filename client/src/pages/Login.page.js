import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import Image from 'react-bootstrap/Image';
import logo from '../resources/images/logo.png';
import background from '../resources/images/lilleB.png';
import React from 'react';

import Button from "react-bootstrap/Button";

import io from 'socket.io-client';

import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBInput,
} from 'mdb-react-ui-kit';


const socket = io('http://localhost:5000');

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // We are consuming our user-management context to
  // get & set the user details here
  const { user, fetchUser, emailPasswordLogin } = useContext(UserContext);

  // We are using React's "useState" hook to keep track
  //  of the form values.
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  // This function will be called whenever the user edits the form.
  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  // This function will redirect the user to the
  // appropriate page once the authentication is done.
  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  }

  // Once a user logs in to our app, we don’t want to ask them for their
  // credentials again every time the user refreshes or revisits our app, 
  // so we are checking if the user is already logged in and
  // if so we are redirecting the user to the home page.
  // Otherwise we will do nothing and let the user to login.
  const loadUser = async () => {
    if (!user) {
      const fetchedUser = await fetchUser();
      if (fetchedUser) {
        // Redirecting them once fetched.
        redirectNow();
      }
    }
  }

  // This useEffect will run only once when the component is mounted.
  // Hence this is helping us in verifying whether the user is already logged in
  // or not.
  useEffect(() => {
    loadUser(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This function gets fired when the user clicks on the "Login" button.
  const onSubmit = async (event) => {
    try {
      // Here we are passing user details to our emailPasswordLogin
      // function that we imported from our realm/authentication.js
      // to validate the user credentials and log in the user into our App.
      const user = await emailPasswordLogin(form.email, form.password);
      if (user) {
        socket.emit('login', user.id, form.email );
        redirectNow();
      }
    } catch (error) {
      if (error.statusCode === 401) {
        alert("Invalid username/password. Try again!");
      } else {
        alert(error);
      }

    }
  };
  
return (
  <>
    <div className="d-flex justify-content-center align-items-center vh-100" style={{backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <MDBContainer className='my-5 justify-content-center'>
        <MDBCard style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 0 50px rgba(0, 0, 0, 0.5)', borderRadius: '10px' }}>
          <MDBRow className='g-0 d-flex align-items-center'>
            <MDBCol md='4'>
              <Image src={logo} className='rounded-t-5 rounded-tr-lg-0' alt="ISENtinel logo" fluid/>
            </MDBCol>
            <MDBCol md='8'>
              <MDBCardBody>
                <MDBInput wrapperClass='mb-4' label='Email address' id='form1' name='email' value={form.email} type='email' onChange={onFormInputChange}/>
                <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' name='password' value={form.password} onChange={onFormInputChange}/>
                <Button className="mb-4 w-100" onClick={onSubmit}>Log in</Button>
                {/*<div className="text-end">
                  <Link to="/signup">Sign up</Link>
                </div>*/}
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </div>
  </>
);
}

export default Login;