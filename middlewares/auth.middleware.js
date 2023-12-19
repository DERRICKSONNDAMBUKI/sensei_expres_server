const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../common/config/config');

const requireSignin = (req, res, next) => {

    // Check if the authorization header is present
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(401).json({ error: 'Authorization header missing: please signin!' });
    }

    // Extract the token from the authorization header
    const token = authorizationHeader.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // Set the user object in the request
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token: please signin' });
    }
};

const hasAuthorization = () => {
  return async (req, res, next) => {
    // Check if the authorization header is present
    const authorizationHeader = req.headers.authorization;
    const { userId } = await req.params

    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Authorization header missing: please signin!' });
    }

    // Extract the token from the authorization header
    const token = authorizationHeader.split(' ')[1];

    try {
      // Verify the token
      const decoded = await jwt.verify(token, jwtSecret);
      req.user = decoded; // Set the user object in the request

      // Check if the user has the required authorization
      if (req.user._id !== userId) {
        return res.status(403).json({ error: 'Unauthorized access: please signin' });
      }

      // Call the next middleware function if the authorization is successful
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
};

// check role e.g if authorized as admin
// const hasAuthorization = (requiredRole) => { // ricky has bugs
//   return (req, res, next) => {
//     // Check if the authorization header is present
//     const authorizationHeader = req.headers.authorization;
//     if (!authorizationHeader) {
//       return res.status(401).json({ error: 'Authorization header missing: please signin!' });
//     }

//     // Extract the token from the authorization header
//     const token = authorizationHeader.split(' ')[1];

//     try {
//       // Verify the token
//       const decoded = jwt.verify(token, jwtSecret);
//       req.user = decoded; // Set the user object in the request

//       // Check if the user has the required role
//       if (req.user.role !== requiredRole) {
//         return res.status(403).json({ error: 'Unauthorized access: please signin' });
//       }
//       // // Check if the user has the required role
//       // if (req.user.role !== requiredRole) {
//       //   return res.status(403).json({ error: 'Unauthorized access: please signin' });
//       // }

//       next();
//     } catch (error) {
//       res.status(401).json({ error: 'Invalid token' });
//     }
//   };
// };

module.exports = {
    requireSignin,
    hasAuthorization
};

// ricky has bugs