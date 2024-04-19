import { BrowserRouter, Route, Routes} from "react-router-dom";

import io from 'socket.io-client';

import { UserProvider } from "./contexts/user.context";

import Home from "./pages/Home.page";
import Login from "./pages/Login.page";
import PrivateRoute from "./pages/PrivateRoute.page";
import Signup from "./pages/Signup.page";
import Event from "./pages/Event.page";
import Users from "./pages/Users.page";
import Anomaly from "./pages/Anomaly.page";
import Info from "./pages/Info.page";
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
 
function App() {
  
  const socket = io('http://localhost:5000');
 return (
   <BrowserRouter>
     {/* We are wrapping our whole app with UserProvider so that */}
     {/* our user is accessible through out the app from any page*/}
     <UserProvider>
       <Routes>
         <Route exact path="/login" element={<Login />} />
         {/*<Route exact path="/signup" element={<Signup />} />*/}
         {/* We are protecting our Home Page from unauthenticated */}
         {/* users by wrapping it with PrivateRoute here. */}
         <Route element={<PrivateRoute />}>
           <Route exact path="/" element={<Home />} />
           <Route exact path="/event" element={<Event />} />
           <Route exact path="/users" element={<Users socket={socket} />} />
           <Route exact path="/anomaly" element={<Anomaly socket={socket} />} />
           <Route exact path="/info" element={<Info />} />
         </Route>
       </Routes>
     </UserProvider>
   </BrowserRouter>
 );
}
 
export default App;