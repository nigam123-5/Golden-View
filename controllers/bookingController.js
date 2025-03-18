const Room = require('../models/room');
const Booking = require('../models/booking');
const User = require('../models/userModel'); // Import the User model



const allocateRoom = async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { roomId, roomNo } = req.body;
  
      console.log(req.body, "req.body", bookingId);
  
      // Validate required input
      if (!roomId || roomNo === undefined) {
        return res.status(400).json({ message: "Please provide roomId and roomNo in the request body" });
      }
  
      // Parse room number to ensure it's a number (as defined in your Booking model)
      const roomNoParsed = parseInt(roomNo, 10);
      if (isNaN(roomNoParsed)) {
        return res.status(400).json({ message: "Invalid room number provided" });
      }
  
      // Fetch the booking details using the bookingId
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // Find the room document that has an available room number matching roomNoParsed
      const room = await Room.findOne({
        _id: roomId,
        roomNumbers: { $elemMatch: { roomNo: roomNoParsed, available: true } }
      });
      if (!room) {
        return res.status(404).json({
          message: "Room not found or not available with the provided room number and id"
        });
      }
  
      // Find the specific room number subdocument
      const roomNumber = room.roomNumbers.find(rn => rn.roomNo === roomNoParsed);
      if (!roomNumber || !roomNumber.available) {
        return res.status(400).json({ message: "Room number is not available" });
      }
  
      // Update booking with the selected room information.
      // We use findByIdAndUpdate with runValidators:false to bypass full validation 
      // (since some required fields may already be missing).
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { $set: { roomNo: roomNoParsed, room: room._id } },
        { new: true, runValidators: false }
      );
  
      // Mark the room number as allocated in the Room document:
      // set available to false, and push this booking's reference into the bookings array of the subdocument.
      await Room.updateOne(
        { _id: room._id, "roomNumbers.roomNo": roomNoParsed },
        {
          $set: { "roomNumbers.$.available": false },
          $push: { "roomNumbers.$.bookings": booking._id }
        }
      );
  
      return res
        .status(200)
        .json({ message: `Room ${roomNoParsed} allocated successfully!`, booking: updatedBooking });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error allocating room." });
    }
  };
  
const checkoutBooking = async (req, res) => {
    try {
        const { id: bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                $set: {
                    "checkOut.status": "checkedOut",
                    "checkOut.date": new Date(),
                },
            },
            { new: true }
        );

        // Mark the room number as available again in the Room document
        if (booking.room && booking.roomNo !== undefined) {
            await Room.updateOne(
                { _id: booking.room, "roomNumbers.roomNo": booking.roomNo },
                { $set: { "roomNumbers.$.available": true } }
            );
        }

        res.json({ message: "Booking checked out successfully", booking: updatedBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during checkout." });
    }
};

const confirmBooking = async (req, res) => {
    try {
        const { id: bookingId } = req.params;
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: "confirmed" },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json({ message: "Booking confirmed successfully", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error confirming booking." });
    }
};


const createBooking = async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            mobile, 
            email, 
            guestList, 
            roomCount, 
            totalGuest, 
            country, 
            address, 
            city, 
            zipCode, 
            agreePrivacyPolicy, 
            room, 
            payment,
            checkIn,
            checkOut
        } = req.body;
        // console.log(req.body,"req.body")
        const user = req.user?.id; // Ensure user is correctly retrieved from JWT

        // Validate required fields including payment details
        if (
            !firstName || 
            !lastName || 
            !mobile || 
            !email || 
            !guestList || 
            !roomCount || 
            !totalGuest || 
            !country || 
            !address || 
            !city || 
            !zipCode || 
            agreePrivacyPolicy === undefined || 
            !room || 
            !payment || 
            !payment.mode || 
            !payment.status ||
            !checkIn ||
            !checkOut
        ) {
            return res.status(400).json({ message: "All required fields, including payment details, must be provided" });
        }
        
        const newBooking = new Booking({
            firstName,
            lastName,
            mobile,
            email,
            guestList,
            roomCount,
            totalGuest,
            country,
            address,
            city,
            zipCode,
            agreePrivacyPolicy,
            user,
            room, 
            checkIn:{ date: new Date(checkIn) },
            checkOut:{ date: new Date(checkOut) },
            payment // Payment details added here
        });
        
        await newBooking.save();
        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        res.status(400).json({ message: "Error creating booking", error: error.message });
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
    updateBooking,
    confirmBooking,
    checkoutBooking

};

