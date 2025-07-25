import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', { email, password });
    try {
      const response = await fetch('https://freelancing-website-12.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      if (response.status === 200 && data.token) {
        console.log('Login successful, storing token:', data.token);
        localStorage.setItem('userToken', data.token); // Store token
        navigate('/user/dashboard'); // Redirect to user dashboard
      } else {
        console.error('Login failed:', data.message || 'No token or unexpected status');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <section className="login-container">
      <div className="login-form">
        <h2 className="login-heading">Login to Your Account</h2>
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
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="login-text">
          Don't have an account? <a href="/signup" className="login-link">Sign Up</a>
        </p>
      </div>
    </section>
  );
}

export default Login;