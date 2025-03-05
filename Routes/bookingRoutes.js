const express = require('express');
const {allocateRoom,
    createBooking,
    getBookingById,
    cancelBooking,
    deleteBooking,
    updateBooking} = require('../controllers/bookingController');

const router = express.Router();

// Controller functions (you need to create these in a separate file)

// Routes
// router.get('/', getAllBookings);
router.post('//booking/:room/:city', createBooking);
 router.get('/booking/:id:id', getBookingById);
router.put('/booking/:id', updateBooking);
router.patch('/booking/:id', cancelBooking);
router.put('/admin/allocateRoom/:bookingId', allocateRoom);
router.delete('/:id', deleteBooking);

module.exports = router;