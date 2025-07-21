import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SellerProfile = ({ apiUrl = 'https://freelancing-website-122.onrender.com' }) => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeller = async () => {
      console.log(`Fetching seller profile for ID: ${sellerId}`);
      try {
        const response = await fetch(`${apiUrl}/api/seller/auth/profile/${sellerId}`);
        console.log(`Response status for seller profile: ${response.status}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Seller data:', data);
          setSeller(data);
        } else {
          setError(`Failed to load seller profile (Status: ${response.status})`);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Error loading seller profile');
      }
    };
    fetchSeller();
  }, [sellerId, apiUrl]);

  if (error) return <div className="text-red-500 p-6">{error}</div>;
  if (!seller) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-semibold mb-6">{seller.name}'s Profile</h2>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <p><strong>Name:</strong> {seller.name}</p>
        <p><strong>Email:</strong> {seller.email}</p>
        <p><strong>Experience:</strong> {seller.experience ? `${seller.experience} years` : 'Not specified'}</p>
        <p><strong>Location:</strong> {seller.place || 'Not specified'}</p>
        <p><strong>Average Price:</strong> {seller.averagePrice ? `$${seller.averagePrice}` : 'Not specified'}</p>
        <p><strong>Services:</strong> {seller.services && seller.services.length > 0 ? seller.services.join(', ') : 'None'}</p>
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
      >
        Back
      </button>
    </div>
  );
};

export default SellerProfile;