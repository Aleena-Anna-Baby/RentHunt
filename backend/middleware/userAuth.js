const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log(" No token sent");

    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.log(" Invalid token:", error.message);

    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = { verifyToken };
