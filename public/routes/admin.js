// routes/admin.js
const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin Login Page
router.get('/login', (req, res) => {
    res.render('admin/login');
});

// Admin Login Handling
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('adminToken', token, { httpOnly: true });
    res.redirect('/admin/dashboard');
});

// Middleware to check if admin is authenticated
function isAdminAuthenticated(req, res, next) {
    const token = req.cookies.adminToken;
    if (!token) {
        return res.redirect('/admin/login');
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.clearCookie('adminToken');
        res.redirect('/admin/login');
    }
}

// Admin Dashboard
router.get('/dashboard', isAdminAuthenticated, async (req, res) => {
    res.render('admin/dashboard');
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/admin/login');
});

module.exports = router;
