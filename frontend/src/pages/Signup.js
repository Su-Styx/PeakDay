import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import './Signup_login.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false); // Track form submission
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { username, email, password };
        console.log(userData);

        // Send user data to the backend
        try {
            const response = await fetch('http://localhost:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                console.log('User registered successfully');
                setSubmitted(true); // Update state to indicate form submission
            } else {
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    if (submitted) {
        // Redirect to home page after successful registration
        window.location.href = '/';
    }

    return (
        <div className="dark-theme">
            <Navbar variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand className="nav-title" href="#home">PeakDay</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/login">Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                <div className="signup-container">
                    <div className="signup-box">
                        <h1>Sign Up</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="signup-fields">
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="field"
                            />
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
                            <Button variant="primary" type="submit" style={{zIndex:'999'}}>Sign up</Button>
                        </div>
    
                    </form>
                </div>
            </Container>
        </div>
    );
}

export default Signup;
