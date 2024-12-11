const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = (req,res,next) =>{
   //check header
   const authHeader = req.headers.authorization
   if (!authHeader || !authHeader.startsWith('Bearer')){
       throw new UnauthenticatedError('Authentification invalid')
   }
   const token = authHeader.split(' ')[1]
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