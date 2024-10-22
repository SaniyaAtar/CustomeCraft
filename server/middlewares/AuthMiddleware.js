import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Safely check if the cookie exists and contains a token
    const tokenCookie = req.cookies?.jwt;

    if (!tokenCookie) {
      return res.status(401).send("You are not authenticated!");
    }

    // Parse the cookie if it's a JSON string, otherwise assume it's already an object
    let token;
    if (typeof tokenCookie === 'string') {
      // If the cookie is a string, it might need parsing
      try {
        token = JSON.parse(tokenCookie).jwt;
      } catch (error) {
        token = tokenCookie;  // Fall back to using the string as the token if parsing fails
      }
    } else if (typeof tokenCookie === 'object' && tokenCookie.jwt) {
      token = tokenCookie.jwt;
    }

    if (!token) {
      return res.status(401).send("You are not authenticated!");
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
      if (err) {
        return res.status(403).send("Token is not valid!");
      }

      // Set the userId from the token payload to the request object
      req.userId = payload?.userId;
      next();
    });
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(500).send("Internal server error");
  }
};
