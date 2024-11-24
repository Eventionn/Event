import jwt from 'jsonwebtoken';

export function verifyAdmin(req, res, next) {
    if (req.user.userType !== '123e4567-e89b-12d3-a456-426614174002') {
      return res.status(403).json({ message: 'User is not an Admin' });
    }
    next();
  };
  