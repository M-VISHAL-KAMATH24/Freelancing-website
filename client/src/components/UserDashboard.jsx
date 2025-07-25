import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Placeholder components
const EditProfile = ({ user, setUser }) => (
  <div className="mt-4 p-4 bg-gray-700 rounded">
    <h4>Edit Profile</h4>
    <input
      type="text"
      value={user.name}
      onChange={(e) => setUser({ ...user, name: e.target.value })}
      className="w-full p-2 mb-2 bg-gray-600 rounded"
    />
    <button
      onClick={() => console.log('Save profile')}
      className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
    >
      Save
    </button>
  </div>
);

const ShowProfile = ({ user }) => (
  <div className="mt-4 p-4 bg-gray-700 rounded">
    <h4>Profile</h4>
    <p>Name: {user.name}</p>
    <p>Email: {user.email}</p>
  </div>
);

const UserDashboard = ({ apiUrl = 'https://freelancing-website-122.onrender.com' }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    console.log('Token in dashboard:', token);
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log('User profile response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setError('');
        } else {
          setError('Failed to load profile');
          navigate('/login');
        }
      } catch (error) {
        console.error('User profile fetch error:', error);
        setError('Error loading profile');
        navigate('/login');
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/seller/service`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log('Services response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          setError('Failed to load services');
        }
      } catch (error) {
        console.error('Services fetch error:', error);
        setError('Error loading services');
      }
    };

    fetchUser();
    fetchServices();
  }, [navigate, apiUrl]);

  const [filters, setFilters] = useState({ types: [], sortBy: 'priceAsc' });
  const [filteredResults, setFilteredResults] = useState([]);

  const uniqueServiceTypes = [...new Set(services.map(service => service.type))].filter(type => type && type.trim() !== '');

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'types') {
      setFilters(prev => ({
        ...prev,
        types: checked ? [...prev.types, value] : prev.types.filter(t => t !== value),
      }));
    } else {
      setFilters(prev => ({ ...prev, sortBy: value }));
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    let results = [...services];
    if (filters.types.length > 0) {
      results = results.filter(service => filters.types.includes(service.type));
    }
    results.sort((a, b) => {
      if (filters.sortBy === 'priceAsc') return a.price - b.price;
      return b.price - a.price;
    });
    setFilteredResults(results);
    console.log('Filtered Results:', results);
  };

  const handleBuy = (serviceId) => {
    navigate(`/payment/${serviceId}`);
  };

  const handleViewProfile = (sellerId) => {
    console.log(`Navigating to seller profile with ID: ${sellerId}`);
    navigate(`/seller/profile/${sellerId}`);
  };

  if (error) return <div className="text-red-500 p-6">{error}</div>;
  if (!user) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <aside className="w-64 bg-gray-800 p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-6 border-b-2 border-gray-700 pb-2">Profile</h3>
        <button
          onClick={() => { setShowEditProfile(!showEditProfile); setShowProfile(false); }}
          className="w-full mb-4 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200"
        >
          Edit Profile
        </button>
        <button
          onClick={() => { setShowProfile(!showProfile); setShowEditProfile(false); }}
          className="w-full p-3 bg-green-600 hover:bg-green-700 rounded-lg transition duration-200"
        >
          Show Profile
        </button>
        {showEditProfile && <EditProfile user={user} setUser={setUser} />}
        {showProfile && <ShowProfile user={user} />}
      </aside>

      <main className="flex-1 p-6">
        <h2 className="text-3xl font-semibold mb-6">Welcome, {user.name}!</h2>

        <div className="mb-8 p-4 bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Filter Services</h3>
          <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h4 className="mb-2">Service Type</h4>
              {uniqueServiceTypes.map(type => (
                <label key={type} className="block mb-2">
                  <input
                    type="checkbox"
                    name="types"
                    value={type}
                    onChange={handleFilterChange}
                    className="mr-2"
                  /> {type}
                </label>
              ))}
            </div>
            <div className="flex-1">
              <h4 className="mb-2">Sort By</h4>
              <select
                name="sortBy"
                onChange={handleFilterChange}
                className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600"
              >
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
            <div className="flex-shrink-0 mt-4 md:mt-0">
              <button
                type="submit"
                className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-200"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredResults.length > 0 ? filteredResults : services).map(service => (
            <div key={service._id} className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
              <h4 className="text-lg font-semibold mb-2">{service.name}</h4>
              <p className="text-sm text-gray-400">Type: {service.type}</p>
              <p className="text-md font-medium">Price: ${service.price}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleViewProfile(service.sellerId)}
                  className="flex-1 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleBuy(service._id)}
                  className="flex-1 p-2 bg-green-600 hover:bg-green-700 rounded-lg transition duration-200"
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;