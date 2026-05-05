import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, CheckCircle } from 'lucide-react';
import { createBooking } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingResponse, setBookingResponse] = useState(null);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [locationStr, setLocationStr] = useState('');
  
  const bookingData = location?.state;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="page-wrapper container flex-center"><h3>Checking session...</h3></div>;
  }

  if (!user) {
    return null; // Prevents flashing content before navigate
  }

  if (!bookingData) {
    return (
      <div className="page-wrapper container animate-fade-in text-center">
        <h2>No booking data found.</h2>
        <button className="btn-primary mt-4" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  const { movie, movieId, showtimeId, date, time, seats, totalAmount } = bookingData;

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const apiPayload = {
        movieId,
        showtimeId,
        seats
      };
      
      // Save the booking to the backend
      const response = await createBooking(apiPayload);
      
      // Update UI with the confirmed booking
      setBookingResponse({
        id: response?.id || response?._id || Math.random().toString(36).substr(2, 9).toUpperCase(),
        totalAmount: totalAmount + 2,
        paymentMethod,
        phoneNumber,
        location: locationStr
      });
      setIsSuccess(true);
    } catch (error) {
      console.error('Booking failed', error);
      alert('Failed to save booking to the backend. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="page-wrapper container animate-fade-in flex-center">
        <div className="success-card glass-panel">
          <CheckCircle size={64} color="#00FFFF" className="success-icon" />
          <h2>Booking Confirmed!</h2>
          <p>Your tickets for <strong>{movie.title}</strong> have been booked successfully.</p>
          <div className="booking-details-box">
            <p><strong>Booking ID:</strong> #{bookingResponse?.id}</p>
            <p><strong>Date & Time:</strong> {date} | {time}</p>
            <p><strong>Seats:</strong> {seats.join(', ')}</p>
            <p><strong>Total Paid:</strong> ${bookingResponse?.totalAmount}</p>
          </div>
          <button className="btn-primary mt-4" onClick={() => navigate('/bookings')}>View My Bookings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper container animate-fade-in">
      <h1 className="page-title">Checkout</h1>
      
      <div className="checkout-grid">
        <div className="summary-col glass-panel">
          <h3>Order Summary</h3>
          <div className="order-movie-info">
            <img src={movie.poster} alt={movie.title} />
            <div>
              <h4>{movie.title}</h4>
              <p className="text-muted">{date} • {time}</p>
            </div>
          </div>
          
          <div className="order-details">
            <div className="detail-row">
              <span>Tickets ({seats.length}x)</span>
              <span>${totalAmount}</span>
            </div>
            <div className="detail-row">
              <span>Convenience Fee</span>
              <span>$2.00</span>
            </div>
            <hr />
            <div className="detail-row total">
              <span>Total Amount</span>
              <span>${totalAmount + 2}</span>
            </div>
          </div>
        </div>

        <div className="payment-col glass-panel">
          <h3>Payment Details</h3>
          
          <div className="payment-methods">
            <label className={`method-tab ${paymentMethod === 'card' ? 'active' : ''}`}>
              <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
              Card
            </label>
            <label className={`method-tab ${paymentMethod === 'upi' ? 'active' : ''}`}>
              <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
              UPI
            </label>
            <label className={`method-tab ${paymentMethod === 'netbanking' ? 'active' : ''}`}>
              <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} />
              Net Banking
            </label>
          </div>

          <form onSubmit={handlePayment} className="payment-form">
            
            <h4 style={{ marginBottom: '-0.5rem', color: 'var(--color-accent)' }}>Contact Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="e.g. +1 234 567 8900" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. New York, NY" 
                  value={locationStr} 
                  onChange={(e) => setLocationStr(e.target.value)} 
                />
              </div>
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />

            {paymentMethod === 'card' && (
              <>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input type="text" required placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <div className="input-icon-wrapper">
                    <CreditCard size={18} className="input-icon" />
                    <input type="text" required placeholder="XXXX XXXX XXXX XXXX" maxLength="19" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="text" required placeholder="MM/YY" maxLength="5" />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="password" required placeholder="XXX" maxLength="3" />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'upi' && (
              <div className="form-group">
                <label>UPI ID</label>
                <input type="text" required placeholder="username@upi" />
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="form-group">
                <label>Select Bank</label>
                <select required className="bank-select">
                  <option value="">Choose your bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                </select>
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary pay-btn"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Confirm Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
