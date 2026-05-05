import './Footer.css';
import { Film } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer glass-panel">
      <div className="container footer-content">
        <div className="footer-brand">
          <Film className="footer-logo-icon" size={24} />
          <h2>Cinephelia</h2>
        </div>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Cinephelia. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
