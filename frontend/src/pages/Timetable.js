import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Navbar, Nav, Modal, Button } from 'react-bootstrap';
import './Timetable.css';
import EventCreationForm from './Eventcreator';
import Weather from'./Weather';
import MoodPopup from './MoodPopup'; 
import HydrationPopup from './HydrationPopup';



axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName ='X-CSRFToken';
axios.defaults.withCredentials = true;


function Timetable() {
    // for mood popup
    const [showMoodPopup, setShowMoodPopup] = useState(false);

    //hydarion popup
    const [hydrationLevel, setHydrationLevel] = useState(0);
    const [showHydrationPopup, setShowHydrationPopup] = useState(true);

    
    const [notification, setNotification] = useState('');
    const [setCurrentUser] = useState(false);
    const [isLoggedIn] = useState(true); // Set to true for demonstration purposes
    const [showNotificationLink, setShowNotificationLink] = useState(false);

    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        // Update currentUser state
        setCurrentUser(false);
    };


    const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
    const [selectedEventForDetails, setSelectedEventForDetails] = useState(null);

    
    // Function to handle opening the event details modal
    const handleShowEventDetails = (event) => {
        setSelectedEventForDetails(event);
        setShowEventDetailsModal(true);
    };



    const [showCreateEventModal, setShowCreateEventModal] = useState(false);
    const today = new Date();
    const formattedDate = today.toLocaleString('default', { month: 'short', day: '2-digit' });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMore, setShowMore] = useState(false);
    const handleShowMore = () => {
        setShowMore(!showMore);
    };
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editedEvent, setEditedEvent] = useState({});
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEvent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };



    
 


    const handleSaveChanges = async () => {
        try {
            if (!selectedEvent || !selectedEvent.id) {
                console.error('No event selected for editing');
                return;
            }
    
            // Retrieve token from localStorage
            const token = localStorage.getItem('token');
    
            // Set the authorization header with the token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
    
            // Send PATCH request to update the event with authentication headers
            await axios.patch(`http://localhost:8000/eventview/events/${selectedEvent.id}/`, editedEvent, config);
    
            // Refresh the list of events after successful update
            const response = await axios.get('http://localhost:8000/eventview/events/');
            setEvents(response.data);
    
            // Clear the edited event state and close the modal
            setEditedEvent({});
            setShowModal(false);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };




    const handleEditDelete = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };
    
    const handleDeleteEvent = async () => {
        try {
            if (!selectedEvent || !selectedEvent.id) {
                console.error('No event selected for deletion');
                return;
            }
            await axios.delete(`http://localhost:8000/eventview/events/${selectedEvent.id}/`);
            // Close the modal and perform any additional actions (e.g., update state)
            const response = await axios.get('http://localhost:8000/eventview/events/');
            setEvents(response.data); // Update the local state with the new data
            setShowModal(false);
            // Perform any other actions, like updating the event list
        } catch (error) {
            console.error('Error deleting event:', error);
            // Handle errors, such as displaying an error message
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            if ((hours === 12 && minutes === 0) || (hours === 17 && minutes === 0)) {
                setShowNotificationLink(true);
            } else {
                setShowNotificationLink(false);
            }
        }, 10000); 
        return () => clearInterval(intervalId);
    }, []);



    const fetchEvents = async () => {
        try {
            // Retrieve token from localStorage
            const token = localStorage.getItem('token');
            let userId = localStorage.getItem('userId');
    
            // Check if userId is not available
            if (!userId) {
                console.error('User ID not found in localStorage');
                return; // Exit the function or handle it gracefully
            }
    
            // Set the authorization header with the token
            const config = {};
            if (token) {
                config.headers = { Authorization: `Bearer ${token}` };
            }
    
            // Use the userId to fetch events with authentication headers
            const eventsResponse = await axios.get(`http://localhost:8000/eventview/events/?event_creator=${userId}`, config);
    
            setEvents(eventsResponse.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };
    
    
    useEffect(() => {
        const showWeeklyHydrationNotification = () => {
            const userId = localStorage.getItem('userId');
            const currentDate = new Date();
            const currentDayOfWeek = currentDate.getDay(); 
            const currentTime = currentDate.getHours();
    
            if (currentDayOfWeek === 5 && currentTime >= 15) {
                const startDateOfWeek = new Date(currentDate);
                startDateOfWeek.setDate(startDateOfWeek.getDate() - currentDayOfWeek);
                const endDateOfWeek = new Date(startDateOfWeek);
                endDateOfWeek.setDate(endDateOfWeek.getDate() + 6);
    
                axios.get(`http://127.0.0.1:8000/api/user-hydration/?user=${userId}`)
                    .then(response => {
                        const userHydration = response.data;
                        const hydrationCount = userHydration.reduce((total, entry) => {
                            const hydrationDatesInWeek = entry.hydration_dates.filter(date => {
                                const dateObj = new Date(date);
                                return dateObj >= startDateOfWeek && dateObj <= endDateOfWeek;
                            });
                            return total + hydrationDatesInWeek.length;
                        }, 0);
    
                        alert(`This week, you've drank water ${hydrationCount} times.`);
    
                        clearInterval(intervalId);
                    })
                    .catch(error => {
                        console.error('Error fetching user hydration:', error);
                    });
    
                // Fetch weather data
                axios.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/guildford/2024-05-15/2024-05-15?unitGroup=metric&key=XXAZEFSWYXXVYVFN77HZVZZUY&contentType=json')
                    .then(response => {
                        const weatherData = response.data;
                        const highestTempOfDay = weatherData.days[0].tempmax;
                        // Display the highest temperature of the day
                        alert(`The highest temperature today is ${highestTempOfDay}°C.`);
                    })
                    .catch(error => {
                        console.error('Error fetching weather data:', error);
                    });
            }
        };
    
        const intervalId = setInterval(showWeeklyHydrationNotification, 60000);
    
        return () => clearInterval(intervalId);
    }, []);
    // Effect to fetch events initially and start polling
    useEffect(() => {
        fetchEvents(); // Fetch events initially

        // Start polling every 5 seconds
        const intervalId = setInterval(() => {
            fetchEvents();
        }, 1); // Adjust the interval as needed

        // Clean up function to stop polling when the component unmounts
        return () => clearInterval(intervalId);

    }, []);
    //for mood popup
    // Effect hook for controlling the display of the MoodPopup
    useEffect(() => {
        const targetHour = 13; // Desired popup hour, e.g., 2 PM
        const checkPopup = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const today = now.toISOString().split('T')[0];
            const moodSelectedToday = localStorage.getItem('moodSelectedDate') === today;

            // Control display based on hour and whether the mood has been selected today
            if (currentHour === targetHour && !moodSelectedToday) {
                setShowMoodPopup(true);
            } else if (moodSelectedToday || currentHour !== targetHour) {
                setShowMoodPopup(false); //supposed to be false but set to true for testing
            }
        };

        // Immediate check and setting up interval
        checkPopup();
        const intervalId = setInterval(checkPopup, 60000); // Check every minute

        // Cleanup on component unmount
        return () => clearInterval(intervalId);
    }, []);

    
    // Function to handle closing the popup
    const handleMoodClose = () => {
        setShowMoodPopup(false);
        localStorage.setItem('moodSelectedDate', new Date().toISOString().split('T')[0]);
    };

    //for hydration popup
    useEffect(() => {

        
        // Check for hydration level from the backend and update hydration level state
        const userId = localStorage.getItem('userId');
        axios.get(`http://127.0.0.1:8000/api/user-hydration/?user=${userId}`)
            .then(response => {
                const userHydration = response.data;
                const currentDate = new Date().toISOString().split('T')[0];
                const hydrationCount = userHydration.reduce((total, entry) => {
                    // Count occurrences of today's date in hydration_dates array for each entry
                    return total + entry.hydration_dates.filter(date => date === currentDate).length;
                }, 0);
                setHydrationLevel(hydrationCount);
            })
            .catch(error => {
                console.error('Error fetching user hydration:', error);
            });
    }, []);
    const handleYes = () => {
        // Increment the hydration level
        setHydrationLevel(prev => prev + 1);
        // Close the hydration popup
        setShowHydrationPopup(false);
    
        // Save to the database
        // Make a POST request to create a new UserHydration instance
        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
        const currentDate = new Date().toISOString().split('T')[0]; // Get the current date
        axios.post(`http://127.0.0.1:8000/api/user-hydration/`, { user: userId, hydration_dates: [currentDate] })
            .then(response => {
                // Handle success response if needed
                console.log('User hydration created successfully:', response.data);
            })
            .catch(error => {
                // Handle error if needed
                console.error('Error creating user hydration:', error);
            });
    };
    
const handleNo = () => {
    // Close the hydration popup
    setShowHydrationPopup(false);

    // Save to the database
    // Make a POST request to your backend API to update the UserHydration model
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date
    axios.post('/api/user-hydration/', { date: currentDate, hydration_level: 0 })
        .then(response => {
            // Handle success response if needed
            console.log('Hydration level updated successfully:', response.data);
        })
        .catch(error => {
            // Handle error if needed
            console.error('Error updating hydration level:', error);
        });
};


    const todayEvents = events.filter(event => {
        const eventDate = new Date(event.event_date);
        return eventDate.toDateString() === today.toDateString();
    });

    const tomorrowEvents = events.filter(event => {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const eventDate = new Date(event.event_date);
        return eventDate.toDateString() === tomorrow.toDateString();
    });

    const toDoEvents = events.filter(event => {
        const eventDate = new Date(event.event_date);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Check if the event is not today and not tomorrow
        return eventDate.toDateString() !== today.toDateString() &&
            eventDate.toDateString() !== tomorrow.toDateString();
    });

    const formatDuration = (duration) => {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;

        if (hours === 0) {
            return `${minutes} mins`;
        } else if (minutes === 0) {
            return `${hours} hr`;
        } else {
            return `${hours} hr ${minutes}`;
        }
    };

    if (loading) {
        return <div>Loading...</div>; // or render a loading spinner
    }

    return (

        
        <div className="dark-theme" style={{ overflowY: 'hidden' }}>
            {showMoodPopup && <MoodPopup onClose={handleMoodClose} />}
            {showHydrationPopup && <HydrationPopup onYes={handleYes} onNo={handleNo} />} 
            <div className="notificationsbox" >
                <div className="notificationsboxtext" >
                Hydration Level: 
                    {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`bar ${i < hydrationLevel ? 'filled' : ''}`}></span>
                    ))}</div>
            </div>
            <div className="notificationsbox">
                <div className="notificationsboxtext" style={{translate:'translateY(80px)',marginTop:'30px'}}>{notification}</div>
            </div>


            {/* Navbar */}
            <Navbar variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand className="nav-title" href="/">PeakDay</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/choosemeal">SearchMeals</Nav.Link>
                            {isLoggedIn && <Button variant="danger" onClick={handleLogout} href="/">Logout</Button>}
                        </Nav>
                        
                    </Navbar.Collapse>
                    
                </Container>
            </Navbar >
            <Weather  setNotification={setNotification} />


            <Container>
            {showNotificationLink && (
                <button
                    className="btn btn-outline-primary"
                    style={{ zIndex: 1001, position: 'relative', left: '1020px', top: '20px'}}
                    onClick={() => window.location.href = '/notification_view'}
                >
                    Meal Recommendations
                </button>
            )}
                <Row>
                    <Col className="col-2" style={{ left: '0px', top: '155px', height: '615px', width: '275px' }}>
                        <div className="heading" style={{ left: '2px', top: '-2px',backgroundColor: '#ffffff',pointerEvents: 'none', }}></div>
                        <div className="headingtext" style={{ top: '31px', left: '130px' }}>To Do</div>
                        <div className='scrolledits' style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {toDoEvents.sort((a, b) => {
                                const dateA = new Date(a.event_date);
                                const dateB = new Date(b.event_date);
                                return dateA - dateB;}).map(event => {
                                const eventDate = new Date(event.event_date);
                                const formattedDate = eventDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                                // Set background color based on event_urgency
                                let backgroundColor;
                                switch (event.event_urgency) {
                                    case 1:
                                        backgroundColor = 'rgba(0, 200, 10, 0.3)';
                                        break;
                                    case 2:
                                        backgroundColor = 'rgba(255, 255, 0, 0.5)';
                                        break;
                                    case 3:
                                        backgroundColor = 'rgba(255, 0, 0, 0.6)';

                                        break;
                                    default:
                                        backgroundColor = 'transparent';
                                        break;
                                }

                                return (
                                    <div className="event-container" key={event.id} style={{ borderRadius: 50, marginTop: '5px', backgroundColor }}>
                <button class="btn btn-outline-primary" className="edit-button" onClick={() => handleShowEventDetails(event)} style={{width:'50px', left:'20px', transform: 'translateY(27px)'}} >Details</button>
                <button class="btn btn-outline-primary" className="edit-button" onClick={() => handleEditDelete(event)} style={{ fontSize: '8px', transform: 'translateX(25px)', width: '35px' }}>Edit</button>

                                        <p style={{ transform: 'translateY(5px)' }}>{event.event_name}</p>
                                        <div className="event-corner-bubble">{formattedDate}</div>
                                    </div>);
                            })}
                        </div>
                    </Col>
                    <Col className="col-2" style={{ left: '20px', top: '155px', height: '615px', width: '275px' }}>
    <div className="heading" style={{ left: '2px', top: '-2px',backgroundColor: '#ffffff',pointerEvents: 'none', }}></div>
    <div className="headingtext" style={{ top: '31px', left: '130px' }}>Today - {formattedDate}</div>
    <div className='scrolledits' style={{ maxHeight: '500px', overflowY: 'auto' }}> { }
    {todayEvents.sort((a, b) => {
            const timeA = new Date(`0000-01-01T${a.event_time}`);
            const timeB = new Date(`0000-01-01T${b.event_time}`);
            return timeA - timeB;
        }).map(event => (
            <div className="event-container" key={event.id} style={{ backgroundColor: 'rgba(177, 225, 255, 0.6)', opacity: 1, borderRadius: 50, marginTop: '5px', position: 'relative' }}>
                <p style={{ color: 'white', opacity: 1, fontSize: 20, position: 'absolute', top: '20%', left: '60%', transform: 'translate(-50%, -50%)' }}>{event.event_name}</p>
                <div className="event-corner-bubble" style={{ color: 'white', }}>{event.event_time}</div>
                <p style={{ color: 'white', opacity: 1, fontSize: 20, transform: 'translateY(30px)' }}>{event.event_description}</p>
                <button class="btn btn-outline-primary" className="edit-button" onClick={() => handleShowEventDetails(event)} style={{width:'50px', left:'20px', transform: 'translateY(27px)'}} >Details</button>
                <button class="btn btn-outline-primary" className="edit-button" onClick={() => handleEditDelete(event)} style={{ fontSize: '8px', transform: 'translateX(25px)', width: '35px' }}>Edit</button>
                
                <div className="event-corner-bubble" style={{ top: '58px', left: '165px', right: '20px', color: 'white', backgroundColor: 'rgba(177, 225, 255, 0.4)' }}>{formatDuration(event.event_duration)}</div>
            </div>
        ))}
    </div>
</Col>
                    <Col className="col-2" style={{ left: '40px', top: '155px', height: '615px', width: '275px' }}>
                        <div className="heading"style={{ left: '2px', top: '-2px',backgroundColor: '#ffffff',pointerEvents: 'none', }}></div>
                        <div className="headingtext" style={{ top: '31px', left: '130px' }}>Tomorrow</div>
                        <div className='scrolledits' style={{ maxHeight: '500px', overflowY: 'auto' }}> { }

                        {tomorrowEvents.sort((a, b) => {
            const timeA = new Date(`0000-01-01T${a.event_time}`);
            const timeB = new Date(`0000-01-01T${b.event_time}`);
            return timeA - timeB;
        }).map(event => (


                                <div className="event-container" key={event.id} style={{ backgroundColor: 'rgba(177, 225, 255, 0.4)', opacity: 1, borderRadius: 50, marginTop: '5px' }}>

                                    <p style={{ color: 'White', opacity: 1, transform: 'translateY(10px)' }}>{event.event_name}</p>
                                    <div className="event-corner-bubble" style={{ color: 'white', backgroundColor: 'rgba(177, 225, 255, 0.4)' }}>{event.event_time}</div>
                                    <button class="btn btn-outline-primary" className="edit-button" onClick={() => handleEditDelete(event)} style={{ fontSize: '8px', transform: 'translateX(25px)', width: '35px' }}>Edit</button>
                                    <button class="btn btn-outline-primary" className="edit-button" onClick={() => handleShowEventDetails(event)} style={{width:'50px', left:'20px', transform: 'translateY(27px)'}} >Details</button>

                                </div>
                            ))}
                        </div>
                        <div className="heading" style={{transform:"translate(167px,-170px)"}}onClick={() => setShowCreateEventModal(true)}>Create Event</div>
                    </Col>
                    <Modal show={showCreateEventModal} onHide={() => setShowCreateEventModal(false)} centered>
    <Modal.Header closeButton>
        <Modal.Title>Create Event</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {/* Render the EventCreationForm component and pass onCloseModal as a prop */}
        <EventCreationForm onCloseModal={() => setShowCreateEventModal(false)} onRefreshEvents={fetchEvents} />
    </Modal.Body>
</Modal>

                    <Col className="col-2" style={{ left: '310px', top: '195px', height: '575px', width: '275px' }}>
                        <div className="heading" style={{ left: '2px', top: '-2px',backgroundColor: '#ffffff' }}></div>
                        <div className="headingtext" style={{ top: '31px', left: '130px',  }}>Event-Requests</div>

                    </Col>
                </Row>

            </Container>

            <Modal show={showEventDetailsModal} onHide={() => setShowEventDetailsModal(false)} centered>
    <Modal.Header closeButton>
        <Modal.Title>Event Details</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {selectedEventForDetails && (
            <div>
                <p>Event Name: {selectedEventForDetails.event_name}</p>
                <p>Event Date: {selectedEventForDetails.event_date}</p>
                <p>Event Time: {selectedEventForDetails.event_time}</p>
                <p>Event Duration: {selectedEventForDetails.event_duration}</p>
                <p>Event Location: {selectedEventForDetails.event_location}</p>
                <p>Event Description: {selectedEventForDetails.event_description}</p>
                <p>Event Urgency: {selectedEventForDetails.event_urgency}</p>
            </div>
        )}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEventDetailsModal(false)}>Close</Button>
    </Modal.Footer>
</Modal>








            <Modal show={showModal} onHide={() => setShowModal(false)} centered hideCloseButton={true}>
                <Modal.Header closeButton={false}>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEvent && (
                        <div>
                            <p>"TESTING" Event id: {selectedEvent.id}</p>

                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={selectedEvent.event_name}
                                    aria-label="Event Name"
                                    aria-describedby="basic-addon2"
                                    name="event_name"
                                    value={editedEvent.event_name || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="input-group mb-3">
                                <input
                                    type="date"
                                    className="form-control"
                                    placeholder={selectedEvent.event_date}
                                    aria-label="Event Date"
                                    aria-describedby="basic-addon2"
                                    name="event_date"
                                    value={editedEvent.event_date || selectedEvent.event_date}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="input-group mb-3">
                                <input
                                    type="time"
                                    className="form-control"
                                    placeholder={selectedEvent.event_time}
                                    aria-label="Event Time"
                                    aria-describedby="basic-addon2"
                                    name="event_time"
                                    value={editedEvent.event_time || selectedEvent.event_time}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {showMore && (
                                <div>
                                    {/* Additional fields */}
                                    {/* Event Location */}
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={selectedEvent.event_location}
                                            aria-label="Event Location"
                                            aria-describedby="basic-addon2"
                                            name="event_location"
                                            value={editedEvent.event_location || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {/* Event Description */}
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={selectedEvent.event_description}
                                            aria-label="Event Description"
                                            aria-describedby="basic-addon2"
                                            name="event_description"
                                            value={editedEvent.event_description || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {/* Event Duration */}
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={selectedEvent.event_duration}
                                            aria-label="Event Duration"
                                            aria-describedby="basic-addon2"
                                            name="event_duration"
                                            value={editedEvent.event_duration || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {/* Event Urgency */}
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={selectedEvent.event_urgency}
                                            aria-label="Event Urgency"
                                            aria-describedby="basic-addon2"
                                            name="event_urgency"
                                            value={editedEvent.event_urgency || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            )}
                            <button className="btn btn-outline-info" onClick={handleShowMore}>
                                {showMore ? 'Show less' : 'Show more'}
                            </button>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="danger" onClick={handleDeleteEvent}>Delete Event</Button>
                    <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
                    
                </Modal.Footer>
            </Modal>
            

        </div>
        
    );
    
}

export default Timetable;
