import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAuthUser, getMovies, addMovie, deleteMovie } from '../services/api';
import { Trash2, PlusCircle, Film } from 'lucide-react';
import './Admin.css';

// Admin email configuration
const ADMIN_EMAIL = 'sajalchourasia19@gmail.com';

const Admin = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [isVerifying, setIsVerifying] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    rating: '',
    cast: '',
    posterUrl: ''
  });

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const currentUser = await getAuthUser();
        const email = currentUser?.email || currentUser?.user?.email;
        if (email !== ADMIN_EMAIL) {
          navigate('/');
        } else {
          setIsVerifying(false);
          fetchMoviesList();
        }
      } catch (error) {
        navigate('/');
      }
    };

    verifyAdmin();
  }, [navigate]);

  const fetchMoviesList = async () => {
    setIsFetching(true);
    try {
      const data = await getMovies();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Format strings into expected types
      const payload = {
        title: formData.title,
        description: formData.description,
        genre: formData.genre.split(',').map(item => item.trim()).filter(Boolean),
        rating: parseFloat(formData.rating) || 0,
        posterUrl: formData.posterUrl,
        duration: parseInt(formData.duration, 10) || 120,
        // Include cast if the backend supports it, otherwise it ignores it
        cast: formData.cast.split(',').map(item => item.trim()).filter(Boolean)
      };

      await addMovie(payload);
      alert('Movie added successfully!');
      
      // Reset form
      setFormData({
        title: '', description: '', genre: '', duration: '', rating: '', cast: '', posterUrl: ''
      });
      
      // Refresh list
      fetchMoviesList();
    } catch (error) {
      console.error('Failed to add movie', error);
      alert('Failed to add movie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSyncMovies = async () => {
    if (!window.confirm('This will fetch and add the latest movies from TMDB. Proceed?')) return;
    
    setIsSyncing(true);
    try {
      const tmdbUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key=fc209ccd321a4f53b2ba5252ab9423ba&language=en-US&page=1';
      const response = await axios.get(tmdbUrl);
      const tmdbMovies = response.data.results;

      // Sequential insert to avoid overwhelming the backend
      for (const movie of tmdbMovies) {
        const payload = {
          title: movie.title,
          description: movie.overview,
          rating: movie.vote_average || 0,
          posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          releaseDate: movie.release_date || new Date().toISOString(),
          isActive: true
        };
        try {
          await addMovie(payload);
        } catch (err) {
          console.error(`Failed to add movie ${movie.title}`, err);
        }
      }

      alert('Movies synced successfully!');
      fetchMoviesList();
    } catch (error) {
      console.error('Failed to sync movies from TMDB', error);
      alert('Failed to sync movies. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(id);
        setMovies(movies.filter(m => (m._id || m.id) !== id));
      } catch (error) {
        console.error('Failed to delete movie', error);
        alert('Failed to delete movie.');
      }
    }
  };

  if (isVerifying) return <div className="page-wrapper container flex-center"><h3>Checking authorization...</h3></div>;

  return (
    <div className="page-wrapper container animate-fade-in admin-page">
      <h1 className="page-title">Admin Dashboard</h1>

      <div className="admin-grid">
        {/* Add Movie Section */}
        <div className="admin-section glass-panel">
          <div className="section-header">
            <PlusCircle className="section-icon" />
            <h2>Add Movie</h2>
          </div>
          <form className="add-movie-form" onSubmit={handleAddMovie}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Inception" />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" placeholder="Movie description..."></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Genre</label>
                <input type="text" name="genre" value={formData.genre} onChange={handleChange} required placeholder="e.g. Sci-Fi, Thriller" />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input type="text" name="duration" value={formData.duration} onChange={handleChange} required placeholder="e.g. 148 min" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rating</label>
                <input type="number" step="0.1" max="10" name="rating" value={formData.rating} onChange={handleChange} required placeholder="e.g. 8.8" />
              </div>
              <div className="form-group">
                <label>Cast (comma separated)</label>
                <input type="text" name="cast" value={formData.cast} onChange={handleChange} required placeholder="e.g. Leo DiCaprio, Tom Hardy" />
              </div>
            </div>

            <div className="form-group">
              <label>Poster Image URL</label>
              <input type="url" name="posterUrl" value={formData.posterUrl} onChange={handleChange} required placeholder="https://..." />
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Movie'}
            </button>
          </form>
        </div>

        {/* Manage Movies Section */}
        <div className="admin-section glass-panel">
          <div className="section-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Film className="section-icon" />
              <h2>Manage Movies</h2>
            </div>
            <button 
              className="btn-secondary" 
              onClick={handleSyncMovies}
              disabled={isSyncing}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              {isSyncing ? 'Syncing...' : 'Sync Latest Movies'}
            </button>
          </div>
          
          <div className="movies-list">
            {isFetching ? (
              <p>Loading movies...</p>
            ) : movies.length === 0 ? (
              <p className="text-muted">No movies found.</p>
            ) : (
              movies.map(movie => (
                <div key={movie._id || movie.id} className="admin-movie-card">
                  <img src={movie.posterUrl || movie.poster} alt={movie.title} className="admin-movie-thumb" />
                  <div className="admin-movie-info">
                    <h4>{movie.title}</h4>
                    <p className="text-muted">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</p>
                  </div>
                  <button 
                    type="button" 
                    className="delete-btn" 
                    onClick={() => handleDeleteMovie(movie._id || movie.id)}
                    title="Delete Movie"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
