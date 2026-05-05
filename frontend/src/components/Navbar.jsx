import { Link, useNavigate } from 'react-router-dom';
import { Film, User, Ticket, LogOut, ShieldCheck } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-content">
        <Link to="/" className="navbar-logo">
          <Film className="logo-icon" size={32} />
          <span>Cinephelia</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/movies" className="nav-link">Movies</Link>
          <Link to="/bookings" className="nav-link">
            <Ticket size={18} />
            My Bookings
          </Link>
          {user && (user.email === 'sajalchourasia19@gmail.com' || user.user?.email === 'sajalchourasia19@gmail.com') && (
            <Link to="/admin" className="nav-link">
              <ShieldCheck size={18} />
              Admin
            </Link>
          )}
          {!loading && (
            user ? (
              <button onClick={handleLogout} className="btn-primary login-btn">
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn-primary login-btn">
                <User size={18} />
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
