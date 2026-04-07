import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <h2 className="footer-logo">Local Worker Finder</h2>
          <p className="footer-tagline">Connecting customers with trusted local workers</p>
        </div>

        <div className="footer-links">
          <span>Home</span>
          <span>Services</span>
          <span>Providers</span>
          <span>Contact</span>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Local Worker Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;