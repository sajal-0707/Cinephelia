import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getMovieById, getMovieShowtimes } from '../services/api';
import './SeatSelection.css';

const SeatSelection = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const showtimeId = searchParams.get('showtimeId');
  
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Rows A-F
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 10;
  
  // Pricing tiers
  const getSeatPrice = (rowId) => {
    if (['A', 'B', 'C'].includes(rowId)) return 10; // Normal
    if (['D', 'E'].includes(rowId)) return 15;      // Premium
    if (rowId === 'F') return 25;                   // Recliner
    return 10;
  };
  
  useEffect(() => {
    getMovieById(id).then(data => {
      const movieData = data.movie || data;
      setMovie(movieData);
    });

    getMovieShowtimes(id).then(data => {
      const times = data.showtimes || data;
      if (Array.isArray(times)) {
        const currentShowtime = times.find(st => st._id === showtimeId);
        setShowtime(currentShowtime);
      }
    });
  }, [id, showtimeId]);

  const takenSeats = showtime ? showtime.bookedSeats : [];

  const toggleSeat = (seatId) => {
    if (takenSeats.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleCheckout = () => {
    if (selectedSeats.length > 0) {
      const totalAmount = selectedSeats.reduce((acc, seat) => acc + getSeatPrice(seat[0]), 0);
      // Pass data to checkout via state
      navigate('/checkout', { 
        state: { 
          movie,
          movieId: movie._id || movie.id,
          showtimeId,
          date: showtime ? new Date(showtime.date).toLocaleDateString() : '', 
          time: showtime ? `${showtime.time} (${showtime.hall})` : '', 
          seats: selectedSeats,
          totalAmount
        } 
      });
    }
  };

  if (!movie) return <div className="loading">Loading...</div>;

  return (
    <div className="page-wrapper container animate-fade-in">
      <div className="seat-selection-header">
        <h1 className="page-title">Select Your Seats</h1>
        <p className="booking-info">
          {movie.title} • {showtime ? new Date(showtime.date).toLocaleDateString() : ''} • {showtime ? showtime.time : ''}
        </p>
      </div>

      <div className="seat-map-container glass-panel">
        <div className="screen-indicator">
          <div className="screen-glow"></div>
          <span>SCREEN</span>
        </div>

        <div className="seat-grid">
          {rows.map(row => (
            <div key={row} className="seat-row">
              <span className="row-label">{row}</span>
              <div className="seats">
                {Array.from({ length: seatsPerRow }).map((_, i) => {
                  const seatId = `${row}${i + 1}`;
                  const isTaken = takenSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);
                  
                  let seatClass = 'seat available';
                  if (isTaken) seatClass = 'seat taken';
                  if (isSelected) seatClass = 'seat selected';
                  
                  // Visual indicator for categories
                  const price = getSeatPrice(row);
                  if (!isTaken && !isSelected) {
                    if (price === 15) seatClass += ' premium';
                    if (price === 25) seatClass += ' recliner';
                  }

                  return (
                    <button
                      key={seatId}
                      className={seatClass}
                      onClick={() => toggleSeat(seatId)}
                      disabled={isTaken}
                      title={seatId}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <span className="row-label right">{row}</span>
            </div>
          ))}
        </div>

        <div className="legend">
          <div className="legend-item">
            <div className="seat available"></div>
            <span>Normal ($10)</span>
          </div>
          <div className="legend-item">
            <div className="seat available premium"></div>
            <span>Premium ($15)</span>
          </div>
          <div className="legend-item">
            <div className="seat available recliner"></div>
            <span>Recliner ($25)</span>
          </div>
          <div className="legend-item">
            <div className="seat selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="seat taken"></div>
            <span>Taken</span>
          </div>
        </div>
      </div>

      <div className="booking-summary glass-panel">
        <div className="summary-details">
          <p>Selected Seats: <strong>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</strong></p>
          <p>Total: <strong>${selectedSeats.reduce((acc, seat) => acc + getSeatPrice(seat[0]), 0)}</strong></p>
        </div>
        <button 
          className="btn-primary" 
          disabled={selectedSeats.length === 0}
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
