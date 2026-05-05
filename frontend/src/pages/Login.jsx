import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    window.location.href = 'https://cinephelia-backend.onrender.com/api/auth/google';
  };

  return (
    <div className="page-wrapper container animate-fade-in flex-center">
      <div className="login-card glass-panel">
        <div className="login-header">
          <h2>Welcome to Cinephelia</h2>
          <p>Sign in to book tickets and manage your bookings</p>
        </div>

        <button 
          className="google-btn" 
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google logo" 
            className="google-icon" 
          />
          {isLoggingIn ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <form className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button type="button" className="btn-primary" onClick={() => navigate('/')}>
            Sign In with Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
