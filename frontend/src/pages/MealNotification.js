import React, { useState, useEffect } from 'react'; 
import { Container, Navbar, Nav, Row, Col, Button, Table } from 'react-bootstrap';
import './MealNotification.css';
import 'react-toastify/dist/ReactToastify.css';

function ChooseMeal() {
    const [randomMeals, setRandomMeals] = useState([]);


    useEffect(() => {
        // Get a random category from the dictionary
        const categories = {
            'meat': ['chicken', 'beef', 'pork', 'fish', 'shrimp', 'seafood'],
            'vegetarian': ['vegetarian', 'vegan'],
            'salad': ['salad'],
            'soup': ['soup'],
            'sandwich': ['sandwich'],
            'pasta': ['pasta'],
            'pizza': ['pizza'],
            'burger': ['burger'],
            'dessert': ['cake', 'cookie', 'cupcake', 'pie', 'ice cream', 'smoothie'],
            'breakfast': ['bread', 'muffin', 'pancake', 'waffle'],
            'rice': ['rice', 'noodle', 'quinoa', 'couscous'],
            'other': ['lasagna', 'fajita', 'omelette', 'crepe', 'burrito', 'enchilada', 'casserole', 'stew', 'grill', 'barbecue', 'roast', 'bake', 'fry', 'saute', 'steam', 'boil', 'stir-fry', 'fried rice']
        };
    
        const categoryKeys = Object.keys(categories);
        const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        const categoryWords = categories[randomCategory];
        const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    
        // Fetch a recipe based on the random word
        fetch(`https://api.api-ninjas.com/v1/recipe?query=${randomWord}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': 'sPfQpzB3c5DNO15z39yxsB5hKaPojXzreLzzNlsg'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch recipe');
            }
            return response.json();
        })
        .then(data => {
            // Assuming the API returns an array of recipes, select one random recipe
            const randomRecipeIndex = Math.floor(Math.random() * data.length);
            const randomRecipe = data[randomRecipeIndex];
    
            // Append the random recipe to the existing recipes in state
            setRandomMeals(prevMeals => [...prevMeals, randomRecipe]);
        })
        .catch(error => {
            console.error('Error fetching recipe:', error);
            alert('Failed to fetch recipe. Please try again later.');
        });
    }, []);
    
    // Function to generate random indexes
    const getRandomIndexes = (max, count) => {
        const indexes = [];
        while (indexes.length < count) {
            const randomIndex = Math.floor(Math.random() * max);
            if (!indexes.includes(randomIndex)) {
                indexes.push(randomIndex);
            }
        }
        return indexes;
    };

    return (
        <div className="dark-theme">
            {/* Navbar */}
            <Navbar variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand className="nav-title" href="/choosemeal">PeakDay</Navbar.Brand>
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
            {/* Renders random meals */}
            <Container className="meals-container" style={{ paddingTop: '80px' }}>
            <h1 style={{ color: 'white', textAlign: 'center' }}> Here are your meal recommendations</h1>
                {randomMeals.map(meal => (
                    <Row key={meal.id} className="meal-row" style={{ marginBottom: '20px' }}>
                        <Col>
                        
                            <h2>{meal.title}</h2>
                            <p>Ingredients: {meal.ingredients}</p>
                            <p>Servings: {meal.servings}</p>
                            <p>Instructions: {meal.instructions}</p>
                        </Col>
                    </Row>
                ))}
            </Container>
        </div>
    );
}

export default ChooseMeal;
