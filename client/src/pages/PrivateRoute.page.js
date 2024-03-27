import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/user.context";

import Spinner from 'react-bootstrap/Spinner';
 
const PrivateRoute = () => {
 
    // Fetching the user from the user context.
    const { user , fetchUser} = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const redirectLoginUrl = `/login?redirectTo=${encodeURI(location.pathname)}`;
 
    useEffect(() => {
        const checkUser = async () => {
        try {
            await fetchUser();
        } catch (error) {
            // Handle error if necessary
        } finally {
            setLoading(false);
        }
        };

        checkUser();
    }, [fetchUser]);

    // If the user is still loading, we are showing a spinner.
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation="border" role="status" style={{height: '10vh', width: '10vh'}}>
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    // If the user is not logged in we are redirecting them
    // to the login page. Otherwise we are letting them to
    // continue to the page as per the URL using <Outlet />.
    return !user ? <Navigate to={redirectLoginUrl} /> : <Outlet /> ;
}
 
export default PrivateRoute;