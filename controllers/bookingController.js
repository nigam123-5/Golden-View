const Room = require('../models/room');
const Booking = require('../models/booking');
const User = require('../models/userModel'); // Import the User model
const nodemailer = require("nodemailer");


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
            checkIn: { date: new Date(checkIn) },
            checkOut: { date: new Date(checkOut) },
            payment // Payment details added here
        });
        
        await newBooking.save();

        // Email configuration and sending
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: "nigamsuryansh921@gmail.com", // Your email
                pass: "bwom agtl cuyl wmym" // Your email app password
            },
        });

        // Email content with styling and hotel name
        const emailContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #fff8e1; padding: 20px; border: 1px solid #ffd54f; border-radius: 10px;">
            <h2 style="color: #ff9800; text-align: center; margin-bottom: 20px;">Hotel Golden View </h2>
            <p style="font-size: 16px;">Dear <strong>${firstName} ${lastName}</strong>,</p>
            <p style="font-size: 16px;">Thank you for choosing <strong style="color: #ffb74d;">Hotel Golden View </strong>!</p>
            <p style="font-size: 16px;">We're delighted to confirm your booking for:</p>
            <ul style="list-style-type: none; padding: 0; font-size: 16px; color: #333;">
              <li><strong style="color: #ff9800;">Check-In Date:</strong> ${checkIn}</li>
              <li><strong style="color: #ff9800;">Check-Out Date:</strong> ${checkOut}</li>
              <li><strong style="color: #ff9800;">Guests:</strong> ${totalGuest}</li>
              <li><strong style="color: #ff9800;">Room Count:</strong> ${roomCount}</li>
              <li style="margin-top: 10px;"><strong style="color: #ff9800;"></strong> <img src="https://drive.google.com/uc?id=1Yi-smOiAh1NweOe04gDaLQSYYqX4Rq9m" alt="Golden Hotel" style="width: 100px; height: auto; display: block; margin-top: 10px;"></li>
            </ul>
            <p style="font-size: 16px;">We look forward to hosting you for a wonderful stay. Should you have any special requests, please feel free to let us know in advance.</p>
            <p style="margin-top: 20px; font-size: 16px;">See you soon!</p>
            <p style="color: #ff9800; font-weight: bold; font-size: 16px; text-align: center;">Hotel Golden View Team</p>
          </div>
        `;

        // Send the email
        const info = await transporter.sendMail({
            from: '"Golden View Hotel" <nigamsuryansh921@gmail.com>',
            to: email,
            subject: "Booking Confirmation - Hotel Golden View ",
            html: emailContent
        });

        console.log("Confirmation email sent: %s", info.messageId);

        res.status(201).json({ 
            message: "Booking created successfully, and confirmation email sent", 
            booking: newBooking 
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ 
            message: "Error creating booking", 
            error: error.message 
        });
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

