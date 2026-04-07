import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import About from "./pages/About";

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BrowseServices from './pages/customer/BrowseServices';
import BookingHistory from './pages/customer/BookingHistory';
import CreateBooking from './pages/customer/CreateBooking';
import GiveReview from './pages/customer/GiveReview';

// Provider Pages
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ManageServices from './pages/provider/ManageServices';
import AddService from './pages/provider/AddService';
import EditService from './pages/provider/EditService';
import ProviderBookings from './pages/provider/ProviderBookings';
import Earnings from './pages/provider/Earnings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageProviders from './pages/admin/ManageProviders';
import AdminBookings from './pages/admin/AdminBookings';
import AllServices from './pages/admin/AllServices';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Routes */}
              <Route path="/customer/dashboard" element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/customer/browse" element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <BrowseServices />
                </ProtectedRoute>
              } />
              <Route path="/customer/history" element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <BookingHistory />
                </ProtectedRoute>
              } />
              <Route path="/customer/book/:serviceId" element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CreateBooking />
                </ProtectedRoute>
              } />
              <Route path="/customer/review/:bookingId" element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <GiveReview />
                </ProtectedRoute>
              } />

              {/* Provider Routes */}
              <Route path="/provider/dashboard" element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ProviderDashboard />
                </ProtectedRoute>
              } />
              <Route path="/provider/services" element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ManageServices />
                </ProtectedRoute>
              } />
              <Route path="/provider/services/add" element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <AddService />
                </ProtectedRoute>
              } />
              <Route path="/provider/services/edit/:id" element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <EditService />
                </ProtectedRoute>
              } />
              <Route path="/provider/bookings" element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ProviderBookings />
                </ProtectedRoute>
              } />
              <Route path="/provider/earnings" element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <Earnings />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/providers" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageProviders />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminBookings />
                </ProtectedRoute>
              } />
              <Route path="/admin/services" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AllServices />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;