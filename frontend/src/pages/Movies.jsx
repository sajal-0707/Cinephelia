import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../services/api';
import { Search, Star, Filter } from 'lucide-react';
import './Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies().then(data => {
      setMovies(data);
      setLoading(false);
    });
  }, []);

  const genres = ['All', ...new Set(movies.flatMap(m => Array.isArray(m.genre) ? m.genre : String(m.genre || '').split(', ')))];

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || (Array.isArray(movie.genre) ? movie.genre.includes(selectedGenre) : String(movie.genre).includes(selectedGenre));
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="page-wrapper container animate-fade-in">
      <div className="movies-header">
        <h1 className="page-title">Now Showing</h1>
        <div className="filters-container glass-panel">
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search movies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="genre-filter">
            <Filter size={20} className="filter-icon" />
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="genre-select"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="movies-grid">
        {loading ? (
          <div className="flex-center" style={{ gridColumn: '1 / -1', minHeight: '300px' }}>
            <h3>Loading movies...</h3>
          </div>
        ) : filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
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
          ))
        ) : (
          <div className="no-results" style={{ gridColumn: '1 / -1' }}>
            <p>No movies found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
