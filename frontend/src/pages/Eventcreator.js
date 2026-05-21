import React, { useState } from 'react';
import axios from 'axios';

const EventCreationForm = ({ onCloseModal, onRefreshEvents }) => {
  const [eventData, setEventData] = useState({
    event_name: '',
    event_date: '',
    event_time: '',
    event_location: '',
    event_description: '',
    event_urgency: '',
    event_duration: '',
    event_creator: localStorage.getItem('userId'), // Set the event_creator to the userId from localStorage
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleEventCreation = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/eventview/events/', eventData);
      console.log(response.data); // Newly created event data
      onCloseModal(); // Close the modal after successful event creation
      onRefreshEvents();
      if (response && response.data) {
        console.log(response.data); // Newly created event data
        onCloseModal(); // Close the modal after successful event creation
        onRefreshEvents(); // Refresh the list of events
      } else {
        console.error('Error: Response data is missing');
      }
    } catch (error) {
      console.error('Error adding event:', error.response.data);
      // Handle error: display an error message, retry logic, etc.
    }
  };

  return (
    <div style={{ maxWidth: '90%', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        Event Name:
        <input type="text" name="event_name" value={eventData.event_name} onChange={handleChange} style={{ width: '100%', padding: '4px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
      </label>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        Event Date:
        <input type="date" name="event_date" value={eventData.event_date} onChange={handleChange} style={{ width: '100%', padding: '4px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
      </label>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        Event Time:
        <input type="time" name="event_time" value={eventData.event_time} onChange={handleChange} style={{ width: '100%', padding: '4px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
      </label>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        Event Location:
        <input type="text" name="event_location" value={eventData.event_location} onChange={handleChange} style={{ width: '100%', padding: '4px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
      </label>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        Event Urgency:
        <input type="integer" name="event_urgency" value={eventData.event_urgency} onChange={handleChange} style={{ width: '100%', padding: '4px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
      </label>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        Event Duration:
        <input type="integer" name="event_duration" value={eventData.event_duration} onChange={handleChange} style={{ width: '100%', padding: '4px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
      </label>
      <label style={{ display: 'block', marginBottom: '10px' }}>
        Event Description:
        <textarea name="event_description" value={eventData.event_description} onChange={handleChange} style={{ width: '100%', padding: '8px', marginBottom: '5px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', height: '70px' }} />
      </label>
      <button onClick={handleEventCreation} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 20px', cursor: 'pointer', fontSize: '16px' }}>Create Event</button>
    </div>
  );
};

export default EventCreationForm;
