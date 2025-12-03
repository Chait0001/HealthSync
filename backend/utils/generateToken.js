import jwt from 'jsonwebtoken';

// Helper to generate a signed JWT for a given user id and role
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export default generateToken;
