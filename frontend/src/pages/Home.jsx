import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllServices } from '../services/serviceService';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      if (user.role === "provider") navigate("/provider/dashboard");
    }
  }, [user, navigate]);

  const fetchServices = async () => {
    try {
      const res = await getAllServices({});
      const allServices = res.data || [];
      setServices(allServices.slice(0, 6));
      const uniqueCategories = [...new Set(allServices.map(s => s.category))];
      setCategories(uniqueCategories.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Find Trusted Local Workers</h1>
            <p>Plumbers, electricians, carpenters, cleaners – book with ease</p>

            <div className="hero-buttons">
              {!user ? (
                <>
                  <Link to="/register" className="btn btn-primary">Get Started</Link>
                  <Link to="/login" className="btn btn-secondary">Login</Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    if (user.role === "customer") navigate("/customer/dashboard");
                  }}
                  className="btn btn-primary"
                >
                  Go to Bookings
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <h2>Popular Categories</h2>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link to={`/customer/browse?category=${cat}`} key={cat} className="category-card">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-services">
        <div className="container">
          <h2>Featured Services</h2>
          {loading ? (
            <p className="loading-text">Loading services...</p>
          ) : services.length === 0 ? (
            <p className="no-services">No services available yet.</p>
          ) : (
            <div className="services-grid">
              {services.map(service => (
                <div key={service._id} className="service-card">
                  <h3>{service.name}</h3>
                  <p className="category">{service.category}</p>
                  <p className="description">{service.description.substring(0, 80)}...</p>
                  <div className="price">₹{service.price}</div>
                  <Link to={`/customer/browse`} className="btn-book">Book Now</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Browse Services</h3>
              <p>Search for workers by category or location</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Book Appointment</h3>
              <p>Select date, time, and address</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Service Done</h3>
              <p>Worker accepts and completes the job</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Rate & Review</h3>
              <p>Share your experience</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;