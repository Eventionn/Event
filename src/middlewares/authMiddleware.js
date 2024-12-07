import jwt from 'jsonwebtoken';
import redis from 'redis';

const redisClient = redis.createClient({
  url: "redis://userservice-redis-service:6379",
});

redisClient.connect();

export async function verifyToken(req, res, next){
    const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  const isBlacklisted = await redisClient.sIsMember("blacklistedTokens", token);
  if (isBlacklisted) {
    return res.status(401).json({ message: 'Token has been invalidated' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded; 
    next();
  });
};
