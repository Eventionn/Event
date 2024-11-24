import jwt from 'jsonwebtoken';

export function verifyAdvertiser(req, res, next){
    if (req.user.userType !== '123e4567-e89b-12d3-a456-426614174001') {
      return res.status(403).json({ message: 'User is not an Advertiser' });
    }
    next();
  };