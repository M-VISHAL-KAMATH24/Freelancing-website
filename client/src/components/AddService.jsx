// 

import React, { useState } from 'react';

const AddService = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: '',
    image: null,
  });
  const [error, setError] = useState('');
  const serviceTypes = ['Web Development', 'Graphic Design', 'Digital Marketing', 'Content Writing', 'Video Editing']; // Predefined types

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, [name]: files[0] }); // Fixed syntax error
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('sellerToken');
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'image') formDataToSend.append(key, value);
    });
    if (formData.image) formDataToSend.append('image', formData.image);

    try {
      const response = await fetch('https://freelancing-website-12.onrender.com/api/seller/service/services', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend,
      });
      const data = await response.json();
      if (response.ok) {
        alert('Service added successfully');
        setFormData({ name: '', type: '', price: '', image: null }); // Reset form
      } else {
        setError(data.message || 'Failed to add service');
      }
    } catch (error) {
      setError('Error adding service');
      console.error(error);
    }
  };

  return (
    <div className="dashboard-section">
      <h3 className="text-xl font-semibold mb-4 text-white text-shadow">Add Service</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white">Service Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-white">Service Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
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
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-white">Service Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <button type="submit" className="dashboard-button">Add Service</button>
      </form>
    </div>
  );
};

export default AddService;