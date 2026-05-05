import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById, getMovieShowtimes } from '../services/api';
import { Star, Clock, Ticket } from 'lucide-react';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [showtimesList, setShowtimesList] = useState([]);

  useEffect(() => {
    getMovieById(id).then(data => {
      const movieData = data.movie || data;
      setMovie(movieData);
    });

    getMovieShowtimes(id).then(data => {
      const times = data.showtimes || data;
      if (Array.isArray(times)) {
        setShowtimesList(times);
        if (times.length > 0) {
          const uniqueDates = [...new Set(times.map(st => st.date.split('T')[0]))];
          setSelectedDate(uniqueDates[0]);
        }
      }
    });
  }, [id]);

  if (!movie) return <div className="loading">Loading...</div>;

  const dates = showtimesList.length > 0 ? [...new Set(showtimesList.map(st => st.date.split('T')[0]))] : [];
  const showtimesForDate = showtimesList.length > 0 ? showtimesList.filter(st => st.date.split('T')[0] === selectedDate) : [];

  return (
    <div className="movie-detail-page animate-fade-in">
      <div className="detail-backdrop" style={{ backgroundImage: `url(${movie.poster})` }}>
        <div className="detail-overlay"></div>
      </div>
      
      <div className="container detail-content">
        <div className="detail-grid">
          <div className="poster-col">
            <img src={movie.poster} alt={movie.title} className="detail-poster" />
          </div>
          <div className="info-col">
            <h1 className="detail-title">{movie.title}</h1>
            <div className="detail-meta">
              <span className="meta-item"><Star size={18} fill="var(--color-accent)" color="var(--color-accent)"/> {movie.rating}/10</span>
              <span className="meta-item"><Clock size={18} /> {movie.duration}</span>
              <span className="meta-item genre-badge">{movie.genre}</span>
            </div>
            
            <div className="detail-section">
              <h3>About the Movie</h3>
              <p>{movie.description}</p>
            </div>

            <div className="detail-section">
              <h3>Cast</h3>
              <p>{movie.cast.join(', ')}</p>
            </div>

            <div className="booking-section glass-panel">
              <h3>Book Tickets</h3>
              <div className="date-selector">
                {dates.length > 0 ? dates.map(date => (
                  <button 
                    key={date}
                    className={`date-btn ${selectedDate === date ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedShowtime(null);
                    }}
                  >
                    {new Date(date).toLocaleDateString()}
                  </button>
                )) : <p>No dates available</p>}
              </div>
              
              <div className="time-selector">
                {showtimesForDate.length > 0 ? showtimesForDate.map(st => (
                  <button 
                    key={st._id}
                    className={`time-btn ${selectedShowtime?._id === st._id ? 'active' : ''}`}
                    onClick={() => setSelectedShowtime(st)}
                  >
                    {st.time} ({st.hall})
                  </button>
                )) : <p>No showtimes available for selected date</p>}
              </div>

              {selectedShowtime && (
                <Link 
                  to={`/movies/${id}/seats?showtimeId=${selectedShowtime._id}`} 
                  className="btn-primary proceed-btn"
                >
                  <Ticket size={20} />
                  Select Seats
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
