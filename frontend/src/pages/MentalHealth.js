
import React from 'react';
import './MentalHealth.css';
import { Container, Row, Col, Navbar, Nav, Modal, Button } from 'react-bootstrap';

const MentalHealth = () => {

  const handleGoBack = () => {
    window.history.back(); // Go back to the previous page
};

  return (

    
    <div className="dark-theme" >
                  <Navbar variant="dark" expand="lg">
                <Container style={{marginTop:'75px'}}>
                    <Navbar.Brand className="nav-title" href="/">PeakDay</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/choosemeal">SearchMeals</Nav.Link>  
                            <button onClick={handleGoBack}>Go Back</button>                
                            </Nav>
                        
                    </Navbar.Collapse>
                    
                </Container>
            </Navbar >
    <div className="mental-health-container" >
      
      <p>Welcome to the mental health and wellbeing page. Here you will find resources and support to help you maintain your mental health.</p>
      <section className="resources">
        <h2>Resources</h2>
        <ul>
          <li><a href="https://www.mentalhealth.gov" target="_blank" rel="noopener noreferrer">MentalHealth.gov</a></li>
          <li><a href="https://www.who.int/mental_health/en/" target="_blank" rel="noopener noreferrer">WHO Mental Health</a></li>
          <li><a href="https://www.nimh.nih.gov" target="_blank" rel="noopener noreferrer">National Institute of Mental Health</a></li>
        </ul>
      </section>
    </div>
    </div>


  );
};

export default MentalHealth;
