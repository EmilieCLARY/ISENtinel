import { Button, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import React from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCheckbox,
} from 'mdb-react-ui-kit'; 

const Signup = () => {
 const navigate = useNavigate();
 const location = useLocation();
 
 // As explained in the Login page.
 const { emailPasswordSignup } = useContext(UserContext);
 const [form, setForm] = useState({
   email: "",
   password: ""
 });
 
 // As explained in the Login page.
 const onFormInputChange = (event) => {
   const { name, value } = event.target;
   setForm({ ...form, [name]: value });
 };
 
 
 // As explained in the Login page.
 const redirectNow = () => {
   const redirectTo = location.search.replace("?redirectTo=", "");
   navigate(redirectTo ? redirectTo : "/");
 }
 
 // As explained in the Login page.
 const onSubmit = async () => {
   try {
    const user = await emailPasswordSignup(document.getElementById('form1').value, document.getElementById('form2').value);
    if (user) {
       redirectNow();
     }
   } catch (error) {
     alert(error);
   }
 };
 
 return <>
 <MDBContainer className='my-5'>
   <MDBCard>

     <MDBRow className='g-0 d-flex align-items-center'>

       <MDBCol md='4'>
         <MDBCardImage src='https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg' alt='phone' className='rounded-t-5 rounded-tr-lg-0' fluid />
       </MDBCol>

       <MDBCol md='8'>

         <MDBCardBody>

           <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email' />
           <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' />

           <div className="d-flex justify-content-between mx-4 mb-4">
              <Link to="/">Login</Link>
            </div>

           <MDBBtn className="mb-4 w-100" onClick={onSubmit}>Sign up</MDBBtn>

         </MDBCardBody>

       </MDBCol>

     </MDBRow>

   </MDBCard>
 </MDBContainer>
</>
}
 
export default Signup;