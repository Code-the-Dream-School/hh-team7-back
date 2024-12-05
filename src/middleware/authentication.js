const User = require('../models/User')
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
    //attach the user to the job route
    req.user = {userId:payload.userId, name:payload.name, isPsychologist:payload.isPsychologist}
    next()
 } catch (error) {
    throw new UnauthenticatedError('Authentification invalid')  
 }
}

 module.exports = auth