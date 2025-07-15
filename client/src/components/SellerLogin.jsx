import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('https://freelancing-website-12.onrender.com/api/seller/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('sellerToken', data.token); // Store token
        navigate('/seller/dashboard'); // Redirect to dashboard
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Error during login');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Seller Login</h2>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Don’t have an account?{' '}
          <button
            onClick={() => navigate('/seller/signup')}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  );
};

export default SellerLogin;