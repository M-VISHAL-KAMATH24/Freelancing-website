import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SellerProfile = ({ apiUrl = 'https://freelancing-website-122.onrender.com' }) => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/seller/auth/profile/${sellerId}`);
        console.log('Seller profile response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Seller data:', data); // Debug seller data
          setSeller(data);
          setError('');
        } else {
          setError('Failed to load seller profile');
        }
      } catch (error) {
        console.error('Seller profile fetch error:', error);
        setError('Error loading seller profile');
      }
    };

    fetchSellerProfile();
  }, [sellerId, apiUrl]);

  if (error) return <div className="text-red-500 p-6">{error}</div>;
  if (!seller) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-semibold mb-6">Seller Profile</h2>
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">{seller.name}</h3>
        <p className="text-gray-400 mb-2">Email: {seller.email}</p>
        {seller.experience && <p className="mb-2">Experience: {seller.experience} years</p>}
        {seller.place && <p className="mb-2">Location: {seller.place}</p>}
        {seller.averagePrice && <p className="mb-2">Average Price: ${seller.averagePrice}</p>}
        {seller.services && seller.services.length > 0 && (
          <div className="mb-2">
            <h4 className="font-semibold">Services Offered:</h4>
            <p>{seller.services.join(', ')}</p>
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => navigate(`/chat/${sellerId}`)}
            className="flex-1 p-2 bg-green-600 hover:bg-green-700 rounded-lg transition duration-200"
          >
            Chat
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;