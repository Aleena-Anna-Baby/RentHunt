const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const extractedToken = token.split(" ")[1];

    const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = adminAuth;
