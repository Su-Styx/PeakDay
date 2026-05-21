import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './Home.css';
import axios from 'axios';
import myImage from './assets/Afpeakdaylogo.png';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName ='X-CSRFToken';
axios.defaults.withCredentials = true;

function DarkThemeHomepage() {
    const [currentUser, setCurrentUser] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const userLoggedIn = localStorage.getItem('token');
        setCurrentUser(!!userLoggedIn);
    }, []);

    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        // Update currentUser state
        setCurrentUser(false);
    };

    return (
        <div className="dark-theme">
            <Navbar variant="dark" expand="lg">
                <Container>
                <Navbar.Brand className="nav-title" href="/">PeakDay</Navbar.Brand>
<Navbar.Toggle aria-controls="basic-navbar-nav" />
<Navbar.Collapse id="basic-navbar-nav">
    <Nav className="ml-auto">
        <Nav.Link href="/">Home</Nav.Link>
        

        {/* Conditionally render Timetable link */}
        {currentUser && <Nav.Link href="/timetable">Timetable</Nav.Link>}
        {currentUser && <Nav.Link href="/choosemeal">SearchMeals</Nav.Link>}

        {/* Conditionally render Signup and Login links */}
        {!currentUser && (
            <>
                <Nav.Link href="/signup">Sign Up</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
            </>
        )}

        {currentUser && (
            <>
                <Button variant="light" size="sm" className="ml-2" onClick={handleLogout}>Logout</Button>
            </>
        )}
        

        
    </Nav>
</Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
                    <img src={myImage} alt="logo" className="Pd" />
                    <div className="text-center">
                        <h1 className="lugrasimo-regular">PeakDay</h1>
                        <p className="subtext">your ultimate timetabling solution</p>
                        <Button variant="light" size="lg" className="mt-3" href="/login">Get Started</Button>
                    </div>
                </div>

                <div className="scroll-down-indicator">
                    <span></span>
                </div>

                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
                    <div className="text-center">
                        {/* Additional content */}
                    </div>
                </div>

                <div>
                    <p className="scrolltext"> </p>
                </div>
            </Container>
        </div>
    );
}

export default DarkThemeHomepage;
