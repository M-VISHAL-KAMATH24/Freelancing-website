import React, { useState } from 'react';

const EditProfile = ({ seller, setSeller }) => {
  const [formData, setFormData] = useState({
    name: seller.name || '',
    experience: seller.experience || '',
    place: seller.place || '',
    averagePrice: seller.averagePrice || '',
    services: seller.services || [],
    image: null,
  });
  const [error, setError] = useState('');
  const serviceOptions = [
    'Web Development',
    'Graphic Design',
    'Digital Marketing',
    'Content Writing',
    'Video Editing',
  ]; // Add more options as needed

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      const updatedServices = checked
        ? [...formData.services, name]
        : formData.services.filter((service) => service !== name);
      setFormData({ ...formData, services: updatedServices });
    } else if (name === 'image') {
      setFormData({ ...formData, [name]: files[0] });
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
      if (key === 'services') {
        formDataToSend.append(key, JSON.stringify(value)); // Send as JSON array
      } else if (key !== 'image') {
        formDataToSend.append(key, value);
      }
    });
    if (formData.image) formDataToSend.append('image', formData.image);

    try {
      const response = await fetch('http://localhost:5000/api/seller/auth/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend,
      });
      const data = await response.json();
      if (response.ok) {
        setSeller(data.seller);
        alert('Profile updated successfully');
      } else {
        setError(data.message || 'Update failed');
      }
    } catch (error) {
      setError('Error updating profile');
      console.error(error);
    }
  };

  return (
    <div className="dashboard-section">
      <h3 className="text-xl font-semibold mb-4 text-white">Edit Profile</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white">Name</label>
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
          <label className="block text-white">Experience (years)</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-white">Place</label>
          <input
            type="text"
            name="place"
            value={formData.place}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-white">Average Price</label>
          <input
            type="number"
            name="averagePrice"
            value={formData.averagePrice}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-white">Services</label>
          <div className="grid grid-cols-2 gap-2">
            {serviceOptions.map((service) => (
              <label key={service} className="flex items-center text-white">
                <input
                  type="checkbox"
                  name={service}
                  checked={formData.services.includes(service)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {service}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-white">Profile Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-700 text-white"
          />
        </div>
        <button type="submit" className="dashboard-button">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;