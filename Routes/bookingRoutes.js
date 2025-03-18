const express = require('express');
const {allocateRoom,
    createBooking,
    getBookingById,
    cancelBooking,
    deleteBooking,
    updateBooking,
    confirmBooking,
    checkoutBooking} = require('../controllers/bookingController');

const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
// Controller functions (you need to create these in a separate file)

// Routes
// router.get('/', getAllBookings);
router.post('/booking', authenticateUser, createBooking);
 router.get('/booking/:id', getBookingById);
router.put('/booking/:id', updateBooking);
router.patch('/booking/:id', cancelBooking);
router.patch('/confirmBooking/:id', confirmBooking);
router.put('/admin/allocateRoom/:bookingId', allocateRoom);
router.delete('/:id', deleteBooking);
router.patch('/checkout/:id', checkoutBooking);


module.exports = router;