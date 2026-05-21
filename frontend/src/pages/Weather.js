import React, { useEffect } from 'react';

function Weather({ setNotification }) {
    const fetchWeatherData = () => {
        fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/guildford/today?unitGroup=metric&elements=datetime%2Ctempmax%2Ctemp%2Ccloudcover&include=hours&key=XXAZEFSWYXXVYVFN77HZVZZUY&contentType=json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data.');
                }
                return response.json(); // Parse the JSON response
            })
            .then(data => {
                // Calculate the best time to go out based on temperature and cloud cover
                const bestTime = calculateBestTime(data);
                
                if (bestTime) {
                    setNotification(`The best time to go out today is at ${bestTime}.`);
                } else {
                    setNotification("All times are about the same today.");
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                setNotification("Failed to fetch weather data.");
            });
    };

    const calculateBestTime = (data) => {
        if (data && data.days && data.days.length > 0) {
            for (const day of data.days) {
                if (day.hours && day.hours.length > 0) {
                    const bestHour = day.hours.find(hour => {
                        return hour.temp >= 15 && hour.temp <= 25 && hour.cloudcover < 50;
                    });
                    if (bestHour) {
                        const [hours, minutes] = bestHour.datetime.split(':').slice(0, 2);
                        const formattedTime = `${hours}:${minutes}`;    
                        return formattedTime;
                    }
                }
            }
        }
        return null;
    };

    useEffect(() => {
        fetchWeatherData();
    }, [setNotification]);

    return null;
}

export default Weather;

