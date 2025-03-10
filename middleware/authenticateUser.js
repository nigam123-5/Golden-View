const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).send({ error: 'Authentication token is missing' });
    }

    try {
        const decoded = jwt.verify(token, 'GoldenHotel');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Invalid authentication token' });
    }
};

module.exports = authenticateUser;