const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied', code: 'NO_TOKEN' });
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error: JWT_SECRET not set' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    console.log('Auth error:', error.message);
    res.status(401).json({ message: 'Token is not valid: ' + error.message, code: 'INVALID_TOKEN' });
  }
};

module.exports = auth;
