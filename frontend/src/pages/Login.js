import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './Signup_login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        if (isLoggedIn()) {
            navigate('/timetable');
        }
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            if (response.ok) {
                // Extract token and userId from response
                const { token, userId } = await response.json();
                
                // Store token and userId in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId); // Make sure userId is defined

                // Redirect to timetable upon successful login
                navigate('/timetable');
            } else {
                // Handle login failure
                console.error('Login failed:', response.statusText);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('An error occurred:', error);
        }
    };

    const isLoggedIn = () => {
        return !!localStorage.getItem('token');
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
                            <Nav.Link href="/signup">Sign Up</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                <div className="login-container">
                    <div className="signup-box">
                        <h1>Log In</h1>
                    </div>
                    <div className="signup-fields">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="field"
                        />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="field"
                        />
                    </div>
                    
                    <div className="signup-bottom" style={{ display: 'flex', justifyContent: 'center' }}>
    <Button onClick={handleSubmit} style={{ display: 'flex', justifyContent: 'center' }}>Log In</Button>
    
</div>
<p style={{zIndex:'999'}}    >Don't have an account? <a href="/signup">Sign Up</a></p>
                </div>
            </Container>
        </div>
    );
}

export default Login;
