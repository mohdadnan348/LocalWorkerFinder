import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* LEFT LOGO */}
        <Link to="/" className="nav-logo">
          <span className="logo-highlight">Local</span>WorkerFinder
        </Link>

        {/* CENTER MENU */}
        <ul className="nav-menu">

          {/* ❌ Guest me kuch nahi dikhayenge */}
          
          {user && user.role === 'customer' && (
            <>
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link to="/customer/dashboard" className="nav-link">Bookings</Link>
              </li>
            </>
          )}

          {user && user.role === 'provider' && (
            <li className="nav-item">
              <Link to="/provider/dashboard" className="nav-link">Dashboard</Link>
            </li>
          )}

          {user && user.role === 'admin' && (
            <li className="nav-item">
              <Link to="/admin/dashboard" className="nav-link">Admin Panel</Link>
            </li>
          )}

        </ul>

        {/* RIGHT SIDE BUTTONS */}
        {!user ? (
          <div className="auth-buttons">
           
            <Link to="/register" className="register-btn">Register</Link>
          </div>
        ) : (
          <button onClick={handleLogout} className="nav-btn-logout">
            Logout ({user.name})
          </button>
        )}

      </div>
    </nav>
  );
};

export default Navbar;