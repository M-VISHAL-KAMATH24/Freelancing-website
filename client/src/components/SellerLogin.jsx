import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SellerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting login with:', { email, password });
    try {
      const response = await fetch('http://localhost:5000/api/seller/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      if (response.ok) {
        console.log('Login successful:', data);
        navigate('/seller-dashboard'); // Redirect to a seller dashboard (to be created)
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <section className="login-container">
      <div className="login-form">
        <h2 className="login-heading">Seller Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email" className="login-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password" className="login-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">Login as Seller</button>
        </form>
        <p className="login-text">
          Not a seller? <a href="/seller-signup" className="login-link">Sign Up</a>
        </p>
        </div>
    </section>
  );
}

export default SellerLogin;