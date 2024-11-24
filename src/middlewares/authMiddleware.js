import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next){
    const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded; 
    next();
  });
};
