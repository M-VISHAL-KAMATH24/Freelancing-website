import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SellerProfile = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await fetch(`https://freelancing-website-12.onrender.com/api/seller/auth/profile/${sellerId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` },
        });
        if (response.ok) {
          const data = await response.json();
          setSeller(data);
          setError('');
        } else {
          setError('Failed to load seller profile');
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setError('Error loading seller profile');
      }
    };
    fetchSeller();
  }, [sellerId]);

  if (error) return <div className="text-red-500 p-6">{error}</div>;
  if (!seller) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-semibold mb-6">Seller Profile</h2>
      <p>Name: {seller.name}</p>
      <p>Email: {seller.email}</p>
      <button
        onClick={() => navigate('/user/dashboard')}
        className="mt-4 p-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default SellerProfile;