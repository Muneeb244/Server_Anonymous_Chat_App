const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    const token = req.header('authorization');
    console.log("from auth", token)
    if(!token) return res.status(401).json({error: 'Access Denied'});
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(400).json({error: 'Invalid Token'});
    }
}