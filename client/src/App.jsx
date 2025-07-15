import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger, SplitText);
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Subhero from './components/Subhero';
import Subhero2 from './components/Subhero2';
import Login from './components/Login';
import Signup from './components/Signup';
import SellerSignup from './components/SellerSignup';
import SellerLogin from './components/SellerLogin';
import SellerDashboard from './components/SellerDashboard';
import UserDashboard from './components/UserDashboard';
import Payment from './components/Payment';
import SellerProfile from './components/SellerProfile';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
<Routes>
  <Route
    path="/"
    element={
      <>
        <Navbar />
        <Hero />
        <Subhero />
        <Subhero2 />
      </>
    }
  />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
   <Route path="/seller/login" element={<SellerLogin />} />
  <Route path="/seller-signup" element={<SellerSignup />} />
  <Route path="/seller/dashboard" element={<SellerDashboard />} />
  <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/payment/:serviceId" element={<Payment />} />
        <Route path="/seller/profile/:sellerId" element={<SellerProfile />} />
</Routes>
      </div>
    </Router>
  );
};

export default App;