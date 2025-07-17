// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import EditProfile from './EditProfile';
// import ShowProfile from './ShowProfile';
// import AddService from './AddService';
// import ShowServices from './ShowServices';

// // Assuming apiUrl is passed via props or context (e.g., from App.jsx)
// const SellerDashboard = ({ apiUrl = 'https://freelancing-website-12.onrender.com' }) => {
//   const [showEditProfile, setShowEditProfile] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [showAddService, setShowAddService] = useState(false);
//   const [showServices, setShowServices] = useState(false);
//   const [seller, setSeller] = useState(null);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('sellerToken');
//     console.log('Token:', token);
//     if (!token) {
//       setError('No token found');
//       navigate('/seller/login');
//       return;
//     }

//     const fetchSeller = async () => {
//       try {
//         const response = await fetch(`${apiUrl}/api/seller/auth/profile`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         });
//         console.log('Profile response status:', response.status);
//         if (response.ok) {
//           const data = await response.json();
//           console.log('Seller data:', data);
//           setSeller(data);
//           setError('');
//         } else {
//           const errorData = await response.json();
//           setError(errorData.message || 'Failed to load profile');
//         }
//       } catch (error) {
//         console.error('Fetch error:', error);
//         setError('Error loading profile. Please try again or log in.');
//       }
//     };
//     fetchSeller();
//   }, [navigate, apiUrl]);

//   if (!seller && !error) return <div className="text-white text-center p-6">Loading...</div>;
//   if (error) return (
//     <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-center">
//         <p className="text-red-500 mb-4">{error}</p>
//         <button
//           onClick={() => navigate('/seller/login')}
//           className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Go to Login
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="dashboard-container">
//       <nav className="dashboard-nav bg-gray-800">
//         <div className="container mx-auto flex justify-between items-center p-4 space-x-4">
//           <h1 className="text-2xl font-bold text-shadow text-white title">WorkVibe!!</h1>
//           <button
//             onClick={() => {
//               localStorage.removeItem('sellerToken');
//               navigate('/seller/login');
//             }}
//             className="dashboard-button bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>
//       <div className="pt-20 pb-6 px-6">
//         <h2 className="text-3xl font-semibold mb-6 text-white text-shadow title">Welcome, {seller.name}!</h2>
//         <div className="flex flex-wrap gap-4 mb-8">
//           <button
//             onClick={() => {
//               setShowEditProfile(!showEditProfile);
//               setShowProfile(false);
//               setShowAddService(false);
//               setShowServices(false);
//             }}
//             className="dashboard-button flex-1 min-w-[120px]"
//           >
//             Edit Profile
//           </button>
//           <button
//             onClick={() => {
//               setShowProfile(!showProfile);
//               setShowEditProfile(false);
//               setShowAddService(false);
//               setShowServices(false);
//             }}
//             className="dashboard-button bg-green-700 hover:bg-green-800 flex-1 min-w-[120px]"
//           >
//             Show Profile
//           </button>
//           <button
//             onClick={() => {
//               setShowAddService(!showAddService);
//               setShowEditProfile(false);
//               setShowProfile(false);
//               setShowServices(false);
//             }}
//             className="dashboard-button bg-purple-700 hover:bg-purple-800 flex-1 min-w-[120px]"
//           >
//             Add Service
//           </button>
//           <button
//             onClick={() => {
//               setShowServices(!showServices);
//               setShowEditProfile(false);
//               setShowProfile(false);
//               setShowAddService(false);
//             }}
//             className="dashboard-button bg-yellow-700 hover:bg-yellow-800 flex-1 min-w-[120px]"
//           >
//             Show Services
//           </button>
//         </div>
//         <div className="dashboard-section">
//           {showEditProfile && <EditProfile seller={seller} setSeller={setSeller} />}
//           {showProfile && <ShowProfile seller={seller} />}
//           {showAddService && <AddService />}
//           {showServices && <ShowServices />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SellerDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfile from './EditProfile';
import ShowProfile from './ShowProfile';
import AddService from './AddService';
import ShowServices from './ShowServices';

// Assuming apiUrl is passed via props or context (e.g., from App.jsx)
const SellerDashboard = ({ apiUrl = 'https://freelancing-website-12.onrender.com' }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    console.log('Mobile Token Check:', token, 'API URL:', apiUrl, 'Platform:', navigator.userAgent);
    if (!token) {
      setError('No token found');
      navigate('/seller/login');
      return;
    }

    const fetchSeller = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/seller/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest', // Helps some mobile browsers
          },
          credentials: 'same-origin', // Adjusted for mobile compatibility
        });
        console.log('Mobile Response Status:', response.status, 'URL:', response.url, 'Headers:', response.headers);
        if (response.ok) {
          const data = await response.json();
          console.log('Mobile Seller Data:', data);
          setSeller(data);
          setError('');
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Network or server error' }));
          console.error('Mobile Error Data:', errorData);
          setError(errorData.message || 'Failed to load profile');
        }
      } catch (error) {
        console.error('Mobile Fetch Error:', error.message, 'Stack:', error.stack, 'Code:', error.code);
        setError('Error loading profile. Please check network or log in again.');
      }
    };
    fetchSeller();
  }, [navigate, apiUrl]);

  if (!seller && !error) return <div className="text-white text-center p-6">Loading...</div>;
  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/seller/login')}
          className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav bg-gray-800">
        <div className="container mx-auto flex justify-between items-center p-4 space-x-4">
          <h1 className="text-2xl font-bold text-shadow text-white title">WorkVibe!!</h1>
          <button
            onClick={() => {
              localStorage.removeItem('sellerToken');
              navigate('/seller/login');
            }}
            className="dashboard-button bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="pt-20 pb-6 px-6">
        <h2 className="text-3xl font-semibold mb-6 text-white text-shadow title">Welcome, {seller.name}!</h2>
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => {
              setShowEditProfile(!showEditProfile);
              setShowProfile(false);
              setShowAddService(false);
              setShowServices(false);
            }}
            className="dashboard-button flex-1 min-w-[120px]"
          >
            Edit Profile
          </button>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowEditProfile(false);
              setShowAddService(false);
              setShowServices(false);
            }}
            className="dashboard-button bg-green-700 hover:bg-green-800 flex-1 min-w-[120px]"
          >
            Show Profile
          </button>
          <button
            onClick={() => {
              setShowAddService(!showAddService);
              setShowEditProfile(false);
              setShowProfile(false);
              setShowServices(false);
            }}
            className="dashboard-button bg-purple-700 hover:bg-purple-800 flex-1 min-w-[120px]"
          >
            Add Service
          </button>
          <button
            onClick={() => {
              setShowServices(!showServices);
              setShowEditProfile(false);
              setShowProfile(false);
              setShowAddService(false);
            }}
            className="dashboard-button bg-yellow-700 hover:bg-yellow-800 flex-1 min-w-[120px]"
          >
            Show Services
          </button>
        </div>
        <div className="dashboard-section">
          {showEditProfile && <EditProfile seller={seller} setSeller={setSeller} />}
          {showProfile && <ShowProfile seller={seller} />}
          {showAddService && <AddService />}
          {showServices && <ShowServices />}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;