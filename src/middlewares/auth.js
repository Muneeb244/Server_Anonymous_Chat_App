const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('authorization');
    if(!token) return res.status(401).send('Access Denied');
    try {
        const user = jwt.verify(token, process.env.jwtSecret);
        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({error: 'Invalid Token'});
    }
}