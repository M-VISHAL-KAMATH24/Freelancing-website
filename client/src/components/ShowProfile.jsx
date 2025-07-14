import React from 'react';

const ShowProfile = ({ seller }) => {
  if (!seller) return <p className="text-white">Loading profile...</p>;

  return (
    <div className="dashboard-section">
      <h3 className="text-2xl font-semibold mb-4 text-white text-shadow">Seller Profile</h3>
      <div className="space-y-4">
        <p className="text-white"><strong>Name:</strong> {seller.name}</p>
        {seller.image && (
          <img
            src={`http://localhost:5000/uploads/${seller.image}`}
            alt="Profile"
            className="w-32 h-32 rounded-full my-4 object-cover border-2 border-gray-700"
          />
        )}
        <p className="text-white"><strong>Experience:</strong> {seller.experience || 'N/A'} years</p>
        <p className="text-white"><strong>Place:</strong> {seller.place || 'N/A'}</p>
        <p className="text-white"><strong>Average Price:</strong> ${seller.averagePrice || 'N/A'}</p>
        <p className="text-white"><strong>Services:</strong> {seller.services.length > 0 ? seller.services.join(', ') : 'N/A'}</p>
      </div>
    </div>
  );
};

export default ShowProfile;