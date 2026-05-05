import { useState, useEffect } from 'react';
import { Ticket } from 'lucide-react';
import { getUserBookings } from '../services/api';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings();
        setBookings(data || []);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="page-wrapper container flex-center"><h3>Loading your bookings...</h3></div>;
  }

  return (
    <div className="page-wrapper container animate-fade-in">
      <h1 className="page-title">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="empty-state glass-panel">
          <Ticket size={48} className="empty-icon" />
          <h2>No bookings found</h2>
          <p>You haven't booked any tickets yet. Explore movies and book your first show!</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card glass-panel">
              <img src={booking.moviePoster} alt={booking.movieTitle} className="booking-poster" />
              <div className="booking-info">
                <h3>{booking.movieTitle}</h3>
                <div className="booking-details">
                  <p><strong>Date:</strong> {booking.date}</p>
                  <p><strong>Time:</strong> {booking.time}</p>
                  <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
                  <p><strong>Total Paid:</strong> ${booking.totalAmount + 2}</p>
                  <p className="booking-id">Booking ID: #{booking.id.toUpperCase()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
