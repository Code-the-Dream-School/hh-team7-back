const jwt = require('jsonwebtoken')
const {UnauthenticatedError, CustomAPIError} = require('../errors')
require("dotenv").config();
const { StatusCodes } = require('http-status-codes')

const auth = (req,res,next) =>{
   // Get token from cookie
   const token = req.cookies[process.env.AUTH_COOKIES_NAME];

   if (!token) {
    throw new CustomAPIError(
        "No token provided, authorization denied", 
        StatusCodes.UNAUTHORIZED
    );
  }
   try {
      const payload = jwt.verify(token,process.env.JWT_Secret)
      //attach the user to the event and registration route
      req.user = { id: payload.id, name: payload.name };
      next()
   } catch (err) {
      if (err.name === 'TokenExpiredError') {
        err.userMessage = 'Session expired, please login again.';
        throw err;
      } else {
        throw new UnauthenticatedError('Authentication invalid');
      }
    }
}

 module.exports = auth