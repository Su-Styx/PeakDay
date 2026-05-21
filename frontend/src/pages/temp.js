// Login Function
import axios from 'axios';
const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/login/', { username, password });
      const token = response.data.token;
      // Save token to local storage
      localStorage.setItem('token', token);
      // Redirect or do other actions upon successful login
    } catch (error) {
      // Handle login error
    }
  }
  
  // Fetch User Data Function
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:8000/user/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = response.data;
        // Use user data as needed
      } catch (error) {
        // Handle fetch user data error (possibly due to unauthenticated access)
      }
    } else {
      // Handle case where no token is found (user is not logged in)
    }
  }
  
  // Logout Function
  const logout = () => {
    // Clear token from local storage
    localStorage.removeItem('token');
    // Redirect or do other actions upon logout
  }
  
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useSpring, animated } from 'react-spring';
import './App.css';
import myImage from './assets/NT-1259797.jpg';
function TimetablingHomepage() {
    return (
        <div className="homepage-container dark-gradient">
            <Navbar bg="transparent" variant="dark" expand="lg" className="navbar">
                <Container>
                    <Navbar.Brand href="#home" className="brand">PeakDay</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="#about">About</Nav.Link>
                            <Nav.Link href="#contact">Contact Us</Nav.Link>
                            <Nav.Link href="/timetable">Timetable</Nav.Link>
                            <Nav.Link href="/choosemeal">Meals</Nav.Link>
                            <Nav.Link href="/signup">Sign Up</Nav.Link>
                            <Nav.Link href="/login">Login</Nav.Link>
                            <Nav.Link href="/notification_view">See your meal notifications</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="main-content">
                <div className="welcome-section">
                    <animated.h1 className="heading-animation">We Are Peakday</animated.h1>
                    <animated.p className="text-animation">Your ultimate solution for managing schedules</animated.p>
                    <div className="button-container">
                        <Button variant="primary" size="lg">Get Started</Button>
                    </div></div>
                    <h2>Features & More Below</h2>
                
                <div class="animated-arrow">
                    <div class="v-shape"></div>
                    <div class="v-shape"></div>
                    <div class="v-shape"></div>
                    </div>

                <div className="features-section">
                    <h2 className="features-heading">Features</h2>
                    <div className="features-grid">
                        <div className="feature">
                            <animated.img src="https://via.placeholder.com/150" alt="Feature 1" className="feature-image" />
                            <h3 className="feature-heading">Feature 1</h3>
                            <p className="feature-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <div className="feature">
                            <animated.img src="https://static.vecteezy.com/system/resources/previews/022/951/451/original/stack-of-documents-icon-png.png" alt="Feature 2" className="feature-image" />
                            <h3 className="feature-heading">Feature 2</h3>
                            <p className="feature-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <div className="feature">
                            <animated.img src="https://via.placeholder.com/150" alt="Feature 3" className="feature-image" />
                            <h3 className="feature-heading">Feature 3</h3>
                            <p className="feature-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <div className="feature">
                            <animated.img src="https://via.placeholder.com/150" alt="Feature 3" className="feature-image" />
                            <h3 className="feature-heading">Feature 4</h3>
                            <p className="feature-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <div className="feature">
                            <animated.img src="https://via.placeholder.com/150" alt="Feature 3" className="feature-image" />
                            <h3 className="feature-heading">Feature 5</h3>
                            <p className="feature-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <div className="feature">
                        <img src={myImage} alt="Feature Image" className="feature-image" />
                            <h3 className="feature-heading">Feature 6</h3>
                            <p className="feature-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                </div>
            </div>
            <img src={myImage} alt="Juwon Pic" className="Juwon" />

            <footer className="footer">
                <p>&copy; 2024 Timetabling App. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default TimetablingHomepage;
