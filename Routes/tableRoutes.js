const express = require('express');
const router = express.Router();
const autthenticate = require('../middleware/authenticateUser')
const { CreateTable, AllBooking, UpdateBooking, DeleteBooking } = require('../controllers/tableController');



// Define routes for table booking
router.post('/tablebooking',autthenticate,CreateTable); // Route for creating a table booking
router.get('/tablebooking',AllBooking); // Route for getting all bookings for a user
router.put('/tablebooking/:id',UpdateBooking); // Route for updating a booking
router.delete('/tablebooking/:id',DeleteBooking); // Route for deleting a booking

module.exports = router;
