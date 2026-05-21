import React, { useState, useEffect } from 'react';
import './MoodPopup.css';  
import axios from 'axios';

function MoodPopup({ onClose }) {
    const handleMoodSelect = async (mood) => {
        try {
            // Assume `axios` is imported and setup is complete
            await axios.post('http://localhost:8000/moods/', {
                date: new Date().toISOString(),
                userId: 'user-id', // This should be dynamically fetched based on the session/user context
                mood: mood
            });
        } catch (error) {
            console.error('Error posting mood:', error);
        }
        onClose(); // Close the popup after submitting
        if (mood === 'Not amazing') {
            window.location.href = '/mental_health/'; // Redirect to /mental_health/ if mood is 'Not amazing'
        }
    };

    return (
        <div className="mood-popup">
            <h3>How are you  feeling today?</h3>
            <div>
                <button onClick={() => handleMoodSelect('Great!')}>Great!</button>
                <button onClick={() => handleMoodSelect('Ehhh')}>Ehhh</button>
                <button onClick={() => handleMoodSelect('Not amazing')}>Sad</button>
            </div>
        </div>
    );
}

export default MoodPopup;
