import React, { useState, useEffect } from 'react';

const ShowServices = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem('sellerToken');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      try {
        console.log('Fetching services with token:', token); // Debug log
        const response = await fetch('http://localhost:5000/api/seller/service/services', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log('Response status:', response.status); // Debug log
        const data = await response.json();
        if (response.ok) {
          setServices(data);
          setError('');
        } else {
          setError(data.message || 'Failed to fetch services');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Error fetching services');
      }
    };

    fetchServices();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!services.length) return <p className="text-white">No services available.</p>;

  return (
    <div className="dashboard-section">
      <h3 className="text-xl font-semibold mb-4 text-white text-shadow">My Services</h3>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service._id} className="p-4 bg-gray-800 rounded-lg shadow-inner">
            <h4 className="text-lg font-medium text-white">{service.name}</h4>
            <p className="text-white">Type: {service.type}</p>
            <p className="text-white">Price: ${service.price}</p>
            {service.image && (
              <img
                src={`http://localhost:5000/uploads/${service.image}`}
                alt={service.name}
                className="w-24 h-24 rounded object-cover mt-2 border-2 border-gray-700"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowServices;