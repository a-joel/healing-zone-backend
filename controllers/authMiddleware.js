const jwt = require("jsonwebtoken");
require('dotenv').config();

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      return res
        .status(400)
        .send({ message: "Authorization does not starts with Bearer" });
    }
    const authHeadersToken = authHeaders.split(" ")[1];

    try {
      
      const decodedToken = jwt.verify(authHeadersToken, process.env.JWT_SECRET_KEY);
      req.user = decodedToken;

      const userRole = decodedToken.role;
      console.log(userRole);
      

      if (userRole === "admin") {
        return next();
      }

      if (userRole === "doctor") {
        return next();
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(400).json({message: "Not a user"})
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  };
};

module.exports = authMiddleware;
