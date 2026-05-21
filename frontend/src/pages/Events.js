// EventList.js
import './Events.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch events from the server
    const fetchEvents = () => {
        axios.get('http://127.0.0.1:8000/eventview/events/')
            .then(response => {
                setEvents(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                setLoading(false);
            });
    };

    // Effect to fetch events initially and start polling
    useEffect(() => {
        fetchEvents(); // Fetch events initially

        // Start polling every 5 seconds
        const intervalId = setInterval(() => {
            fetchEvents();
        }, 5000); // Adjust the interval as needed

        // Clean up function to stop polling when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return <div>Loading...</div>; // or render a loading spinner
    }

    return (
        <div>
            <h2>Events</h2>
            {events.map(event => (
                <div className="event-container" key={event.id}>
                    <p>{event.event_name}</p>
                    {/* Add other event details here */}
                </div>
            ))}
        </div>
    );
}

export default EventList;
