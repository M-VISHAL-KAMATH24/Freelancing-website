import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Payment = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const handlePayment = () => {
    // Placeholder for payment processing (e.g., Stripe, PayPal)
    console.log('Processing payment for service:', serviceId);
    navigate('/user/dashboard'); // Redirect to dashboard after payment
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-semibold mb-6">Payment for Service {serviceId}</h2>
      <p>Processing payment... (Implement with a payment gateway)</p>
      <button
        onClick={handlePayment}
        className="mt-4 p-2 bg-green-600 hover:bg-green-700 rounded"
      >
        Confirm Payment
      </button>
    </div>
  );
};

export default Payment;