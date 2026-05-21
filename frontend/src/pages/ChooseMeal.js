import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Form, FormControl, Button, Table } from 'react-bootstrap';
import './ChooseMeal.css';

function ChooseMeal() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = () => {
        // Ensure searchQuery is not empty before sending the request
        if (!searchQuery.trim()) {
            alert("Please enter a search query.");
            return;
        }
        // Construct the query parameters for the API
    
        // Fetch recipes from the API with the search query
        fetch(`https://api.api-ninjas.com/v1/recipe?query=${searchQuery}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': 'sPfQpzB3c5DNO15z39yxsB5hKaPojXzreLzzNlsg'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch recipes');
            }
            return response.json();
        })
        .then(data => {
            // Assuming the API returns an array of recipes, format the data
            const formattedRecipes = data.map(recipe => ({
                id: recipe.id, // Assuming id is unique for each recipe
                title: recipe.title,
                ingredients: recipe.ingredients,
                servings: recipe.servings,
                instructions: recipe.instructions
            }));
    
            // Set the search results
            setSearchResults(formattedRecipes);
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            alert('Failed to fetch recipes. Please try again later.');
        });
    };
    
    return (
        <div className="dark-theme">
            <Navbar variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand className="nav-title" href="/choosemeal">PeakDay</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/timetable">Timetable</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Search bar and button */}
            <h1 style={{ zIndex:'999', color: 'white', textAlign: 'center' }}>Enter the recipe you want</h1>
            <Container>
                <Row style={{ marginTop: '20px' }}>
                    <Col>
                        <div className="search-bar">
                            <Form inline onSubmit={e => { e.preventDefault(); handleSearch(); }}>
                                <FormControl 
                                    type="text" 
                                    placeholder="Search" 
                                    className="mr-sm-2" 
                                    value={searchQuery} 
                                    onChange={e => setSearchQuery(e.target.value)} 
                                />
                                <Button variant="outline-success" type="submit">Search</Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
            
            {/* Render search results */}
            {searchResults && searchResults.length > 0 && (
                <Container>
                    <Row>
                        <Col>
                            <h2>Search Results</h2>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Ingredients</th>
                                        <th>Servings</th>
                                        <th>Instructions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map(recipe => (
                                        <tr key={recipe.id}>
                                            <td>{recipe.title}</td>
                                            <td>{recipe.ingredients}</td>
                                            <td>{recipe.servings}</td>
                                            <td>{recipe.instructions}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            )}
        </div>
    );
}

export default ChooseMeal;
