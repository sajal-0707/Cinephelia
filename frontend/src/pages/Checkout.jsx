import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';
import { createBooking } from '../services/api';
import { API_URL } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const bookingData = location?.state;

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  if (loading) return <div className="page-wrapper container flex-center"><h3>Checking session...</h3></div>;
  if (!user) return null;

  if (!bookingData) {
    return (
      <div className="page-wrapper container animate-fade-in text-center">
        <h2>No booking data found.</h2>
        <button className="btn-primary mt-4" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  const { movie, movieId, showtimeId, date, time, seats, totalAmount } = bookingData;
  const finalAmount = totalAmount + 2;

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Step 1: Create Razorpay order
      const orderRes = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) throw new Error('Failed to create order');

      // Step 2: Open Razorpay popup
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'Cinephelia',
        description: `Tickets for ${movie.title}`,
        order_id: orderData.order.id,
        prefill: {
          name: user.name,
          email: user.email,
          contact: phoneNumber,
        },
        theme: { color: '#00FFFF' },
        handler: async function (response) {
          // Step 3: Verify payment
          const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();

          if (!verifyData.success) throw new Error('Payment verification failed');

          // Step 4: Create booking
          const booking = await createBooking({ movieId, showtimeId, seats });

          setBookingResponse({
            id: booking?.booking?.bookingId || booking?._id,
            totalAmount: finalAmount,
          });
          setIsSuccess(true);
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment failed', error);
      alert('Payment failed. Please try again.');
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
            <p><strong>Total Paid:</strong> ₹{bookingResponse?.totalAmount}</p>
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
              <span>₹{totalAmount}</span>
            </div>
            <div className="detail-row">
              <span>Convenience Fee</span>
              <span>₹2.00</span>
            </div>
            <hr />
            <div className="detail-row total">
              <span>Total Amount</span>
              <span>₹{finalAmount}</span>
            </div>
          </div>
        </div>

        <div className="payment-col glass-panel">
          <h3>Payment Details</h3>
          <form onSubmit={handlePayment} className="payment-form">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              You'll be redirected to Razorpay's secure payment page to complete your payment via Card, UPI, or Net Banking.
            </p>

            <button
              type="submit"
              className="btn-primary pay-btn"
              disabled={isProcessing}
            >
              {isProcessing ? 'Opening Payment...' : `Pay ₹${finalAmount}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;