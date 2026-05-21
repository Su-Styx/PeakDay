import React from 'react';
import './HydrationPopup.css';  
import axios from 'axios';

//need to add the part where it can store in the database
const HydrationPopup = ({ onYes, onNo }) => (
    <div className="hydration-popup">
        <p>Have you had a glass of water this hour?</p>
        <button onClick={onYes}>Yes</button>
        <button onClick={onNo}>No</button>
    </div>
);

export default HydrationPopup;
