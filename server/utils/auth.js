const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';



module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    let token = req.query.token || req.headers.authorization;
  
    // Logging statements for debugging
    console.log('Token:', token);
  
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
  
    console.log('Cleaned Token:', token);

    if (!token) {
      return { user: null };
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
      return { user: null };
    }

    // return updated request object
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};