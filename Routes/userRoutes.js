const express = require('express');
const { getAllUsers, signup,login, getUserById, updateUser } = require('../controllers/userController');

const router = express.Router();

// Controller functions (you need to create these in a separate file)

// Routes
router.get('/', getAllUsers);
router.post('/signup', signup);
router.post('/login', login);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

module.exports = router;