const express = require('express');
const { allocateRoom } = require('../controllers/bookingController');
const { getAllRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');

const router = express.Router();

// Room Routes
router.get('/getRoom', getAllRooms);
router.post('/createRoom', createRoom);
// router.get('/:id', getRoomById);
router.put('/room/:id', updateRoom);
router.delete('/room/:id', deleteRoom);

// Booking Routes
router.put('/admin/allocateRoom/:bookingId', allocateRoom);

module.exports = router;
