import React, { useState, useEffect } from 'react';

const ShowServices = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    type: '',
    price: '',
    image: null,
  });
  const serviceTypes = ['Web Development', 'Graphic Design', 'Digital Marketing', 'Content Writing', 'Video Editing'];

  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem('sellerToken');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      try {
        console.log('Fetching services with token:', token);
        const response = await fetch('http://localhost:5000/api/seller/service/services', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log('Response status:', response.status);
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

  const handleEdit = (service) => {
    setEditingService(service._id);
    setEditFormData({
      name: service.name,
      type: service.type,
      price: service.price,
      image: null,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditFormData({ ...editFormData, [name]: files[0] });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('sellerToken');
    const formDataToSend = new FormData();
    Object.entries(editFormData).forEach(([key, value]) => {
      if (key !== 'image') formDataToSend.append(key, value);
    });
    if (editFormData.image) formDataToSend.append('image', editFormData.image);

    try {
      const response = await fetch(`http://localhost:5000/api/seller/service/services/${editingService}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend,
      });
      console.log('Edit response status:', response.status); // Debug log
      const data = await response.json();
      if (response.ok) {
        setServices(services.map((s) => (s._id === editingService ? data.service : s)));
        setEditingService(null);
        setEditFormData({ name: '', type: '', price: '', image: null });
      } else {
        setError(data.message || 'Failed to update service');
      }
    } catch (error) {
      setError('Error updating service');
      console.error('Edit error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const token = localStorage.getItem('sellerToken');
      try {
        const response = await fetch(`http://localhost:5000/api/seller/service/services/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log('Delete response status:', response.status); // Debug log
        const data = await response.json();
        if (response.ok) {
          setServices(services.filter((s) => s._id !== id));
        } else {
          setError(data.message || 'Failed to delete service');
        }
      } catch (error) {
        setError('Error deleting service');
        console.error('Delete error:', error);
      }
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!services.length) return <p className="text-white">No services available.</p>;

  return (
    <div className="dashboard-section">
      <h3 className="text-xl font-semibold mb-4 text-white text-shadow">My Services</h3>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service._id} className="p-4 bg-gray-800 rounded-lg shadow-inner flex justify-between items-start">
            <div>
              <h4 className="text-lg font-medium text-white">{service.name}</h4>
              <p className="text-white">Type: {service.type}</p>
              <p className="text-white">Price: ${service.price}</p>
              {service.image && (
                <img
                  src={`https://freelancing-website-9k60.onrender.com/uploads/${service.image}`}
                  alt={service.name}
                  className="w-24 h-24 rounded object-cover mt-2 border-2 border-gray-700"
                />
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(service)}
                className="dashboard-button bg-blue-700 hover:bg-blue-800 px-3 py-1 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service._id)}
                className="dashboard-button bg-red-700 hover:bg-red-800 px-3 py-1 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {editingService && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-inner">
            <h4 className="text-lg font-medium text-white mb-2">Edit Service</h4>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white">Type</label>
                <select
                  name="type"
                  value={editFormData.type}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  required
                >
                  <option value="" disabled>Select a type</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white">Price</label>
                <input
                  type="number"
                  name="price"
                  value={editFormData.price}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                />
              </div>
              <div className="space-x-2">
                <button type="submit" className="dashboard-button bg-green-700 hover:bg-green-800 px-3 py-1">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="dashboard-button bg-gray-700 hover:bg-gray-800 px-3 py-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowServices;