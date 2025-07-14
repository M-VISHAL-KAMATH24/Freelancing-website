import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfile from './EditProfile';
import ShowProfile from './ShowProfile';
import AddService from './AddService';
import ShowServices from './ShowServices';

const SellerDashboard = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    console.log('Token:', token);
    if (!token) {
      navigate('/seller/login');
      return;
    }

    const fetchSeller = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/seller/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Seller data:', data);
          setSeller(data);
          setError('');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to load profile');
          navigate('/seller/login');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Error loading profile');
        navigate('/seller/login');
      }
    };
    fetchSeller();
  }, [navigate]);

  if (!seller && !error) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-shadow">FreelanceFlow</h1>
          <button
            onClick={() => {
              localStorage.removeItem('sellerToken');
              navigate('/seller/login');
            }}
            className="dashboard-button bg-red-700 hover:bg-red-800"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="mt-6">
        <h2 className="text-3xl font-semibold mb-6 text-shadow">Welcome, {seller.name}!</h2>
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setShowEditProfile(!showEditProfile);
              setShowProfile(false);
              setShowAddService(false);
              setShowServices(false);
            }}
            className="dashboard-button"
          >
            Edit Profile
          </button>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowEditProfile(false);
              setShowAddService(false);
              setShowServices(false);
            }}
            className="dashboard-button bg-green-700 hover:bg-green-800"
          >
            Show Profile
          </button>
          <button
            onClick={() => {
              setShowAddService(!showAddService);
              setShowEditProfile(false);
              setShowProfile(false);
              setShowServices(false);
            }}
            className="dashboard-button bg-purple-700 hover:bg-purple-800"
          >
            Add Service
          </button>
          <button
            onClick={() => {
              setShowServices(!showServices);
              setShowEditProfile(false);
              setShowProfile(false);
              setShowAddService(false);
            }}
            className="dashboard-button bg-yellow-700 hover:bg-yellow-800"
          >
            Show Services
          </button>
        </div>
        <div className="dashboard-section">
          {showEditProfile && <EditProfile seller={seller} setSeller={setSeller} />}
          {showProfile && <ShowProfile seller={seller} />}
          {showAddService && <AddService />}
          {showServices && <ShowServices />}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;