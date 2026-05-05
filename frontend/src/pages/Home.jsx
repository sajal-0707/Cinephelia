import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../services/api';
import { Play, Star } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies().then(data => {
      setFeaturedMovies(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="home-page animate-fade-in">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">Experience the Magic of Cinema</h1>
          <p className="hero-subtitle">Book tickets for the grandest blockbusters and timeless classics.</p>
          <Link to="/movies" className="btn-primary hero-btn">
            <Play size={20} fill="currentColor" />
            Book Now
          </Link>
        </div>
      </section>

      <section className="featured-section container">
        <h2 className="section-title">Featured Premieres</h2>
        {loading ? (
          <div className="flex-center" style={{ minHeight: '200px' }}>
            <h3>Loading movies...</h3>
          </div>
        ) : (
          <div className="movies-grid">
            {featuredMovies.map(movie => (
              <Link to={`/movies/${movie._id || movie.id}`} key={movie._id || movie.id} className="movie-card glass-panel">
                <div className="movie-poster-wrapper">
                  <img src={movie.posterUrl || movie.poster} alt={movie.title} className="movie-poster" />
                  <div className="movie-rating">
                    <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                    <span>{movie.rating}</span>
                  </div>
                </div>
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p className="movie-genre">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</p>
                  <button className="btn-secondary book-btn">View Details</button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
