const Room = require('../models/room');
const Booking = require('../models/booking');
const User = require('../models/userModel'); // Import the User model



const allocateRoom = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { roomId, roomNo } = req.body;

        // Validate required fields
        if (!roomId || !roomNo) {
            return res.status(400).json({ message: "Please provide roomId and roomNo in the request body" });
        }

        // Fetch the booking details
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Fetch the room by roomId that contains the room number
        const room = await Room.findOne({
            _id: roomId,
            "roomNumbers.roomNo": roomNo,
            available: true
        });

        if (!room) {
            return res.status(404).json({ message: "Room not found or not available with the provided room number and id" });
        }

        // Find the specific room number object
        const roomNumber = room.roomNumbers.find(rn => rn.roomNo === roomNo);

        if (!roomNumber || !roomNumber.available) {
            return res.status(400).json({ message: "Room number is not available" });
        }

        // Allocate the room by updating the booking
        booking.roomNo = roomNo;
        booking.room = room._id; // Update the room reference
        await booking.save();

        // Update the room number's availability to false
        await Room.updateOne(
            { _id: room._id, "roomNumbers.roomNo": roomNo },
            {
                $set: { "roomNumbers.$.available": false },
                $push: { "roomNumbers.$.bookings": booking._id }
            }
        );

        res.status(200).json({ message: `Room ${roomNo} allocated successfully!`, booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error allocating room." });
    }
};

const createBooking = async (req, res) => {
    try {
        const { firstName, lastName, mobile, email, date, guestList, roomCount, totalGuest, country, address, city, zipCode, room, pyment, status } = req.body;
        const user = req.user.id;
        console.log(user,"users",req.body) // Replace with the actual user ID from JWT
        // Check required fields
        if (!firstName || !lastName || !mobile || !email || !date || !guestList || !roomCount || !totalGuest || !country || !address || !city || !zipCode || !room || !pyment || !status) {
            return res.status(400).json({ success: false, message: "All required fields must be provided." });
        }
        
        const booking = new Booking({
            firstName,
            lastName,
            mobile,
            email,
            date,
            guestList,
            roomCount,
            totalGuest,
            country,
            address,
            city,
            zipCode,
            room,
            pyment,
            status,
            user
        });
        await booking.save();
        
        // Associate the booking with the user
        await User.findByIdAndUpdate(user, { $push: { bookings: booking._id } });
        
        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};



// Update booking route
const updateBooking =  async (req, res) => {
    try {
        const { firstName, lastName, mobile, email, country, address, zipCode, cancellation, checkIn, checkOut, date } = req.body;

        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, {
            firstName,
            lastName,
            mobile,
            email,
            date,
            country,
            address,
            zipCode,
            cancellation,
            checkIn,
            checkOut,
        }, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json({ message: "Booking updated successfully", booking: updatedBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating booking." });
    }
};

// Get booking by ID
const getBookingById =  async (req, res) => {
    try {
        const { id: bookingId } = req.params;

        const booking = await Booking.findById(bookingId).populate('user room');

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Cancel booking route
const cancelBooking =  async (req, res) => {
    try {
        const { id: bookingId } = req.params;

        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, { cancellation: true }, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json({ message: "Booking cancelled successfully", booking: updatedBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error cancelling booking." });
    }
};

// Delete booking route
const  deleteBooking = async (req, res) => {
    try {
        const { id: bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const roomId = booking.room;
        const userId = booking.user;

        await Booking.findByIdAndDelete(bookingId);
        await Room.findByIdAndUpdate(roomId, { $pull: { booking: bookingId } });

        if (userId) {
            await User.findByIdAndUpdate(userId, { $pull: { booking: bookingId } });
        }

        res.json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting booking." });
    }
};


module.exports = {
    allocateRoom,
    createBooking,
    getBookingById,
    cancelBooking,
    deleteBooking,
    updateBooking

};

