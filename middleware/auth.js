const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// check authenticate 
const authenticate = async (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(401).json({error: 'Please login to get access'})
    }

    const tokenDetail = jwt.verify(token, SECRET_KEY);
    console.log('token',tokenDetail);
    req.user = tokenDetail;
    return next();
}

module.exports = {authenticate}