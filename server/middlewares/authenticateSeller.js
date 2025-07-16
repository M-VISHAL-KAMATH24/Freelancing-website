const jwt = require('jsonwebtoken');

const authenticateSeller = (req, res, next) => {
  console.log('🔐 authenticateSeller middleware triggered');
  const authHeader = req.headers.authorization;
  console.log('🧭 Authorization header:', authHeader);

  if (!authHeader) {
    console.error('❌ No auth header');
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  console.log('🎟️ Token extracted:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified:', decoded);
    req.seller = { id: decoded.id };
    next();
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateSeller;
