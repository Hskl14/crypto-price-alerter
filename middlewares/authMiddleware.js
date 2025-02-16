const jwt = require("jsonwebtoken");
const config = require('../config');
const logger = require('../utils/logger');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ message: "No Bearer Token, authorization denied" });

  try {
    const decoded = jwt.verify(token, config.app.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn(`WARN | authMiddleware.authMiddleware | Unauthorized`); // TODO add client info (IP,agent,etc)
    res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
