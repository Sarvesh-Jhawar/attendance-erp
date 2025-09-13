import React, { useState, useEffect } from 'react';

const EventsDisplay = () => {
  const [activeEvents, setActiveEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndFilterEvents = async () => {
      try {
        const response = await fetch('/events.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const events = await response.json();

        const today = new Date();
        // Set time to midnight to compare dates only, ignoring time.
        today.setHours(0, 0, 0, 0);

        const filteredEvents = events.filter(event => {
          // Using new Date(YYYY, MM-1, DD) creates a date in the local timezone at midnight,
          // which avoids timezone-related comparison issues.
          const [startYear, startMonth, startDay] = event.startDate.split('-').map(Number);
          const startDate = new Date(startYear, startMonth - 1, startDay);

          const [endYear, endMonth, endDay] = event.endDate.split('-').map(Number);
          const endDate = new Date(endYear, endMonth - 1, endDay);

          // Check if today's date is within the start and end dates (inclusive).
          return today >= startDate && today <= endDate;
        });

        setActiveEvents(filteredEvents);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterEvents();
  }, []); // Empty dependency array ensures this runs once when the component mounts.

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error fetching events: {error}</div>;
  }

  return (
    <div>
      <h1>Active Events</h1>
      {activeEvents.length > 0 ? (
        <ul>
          {activeEvents.map(event => (
            <li key={event.id}>
              <h2>{event.eventName}</h2>
              <p>Club: {event.clubName}</p>
              <img src={process.env.PUBLIC_URL + event.posterUrl} alt={`${event.eventName} poster`} style={{ maxWidth: '200px' }} />
              <p>
                <a href={event.link} target="_blank" rel="noopener noreferrer">
                  Event Link
                </a>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active events at the moment.</p>
      )}
    </div>
  );
};

export default EventsDisplay;