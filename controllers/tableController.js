const express = require('express');
const Tablebooking = require('../models/table'); // Import the model 
const router = express.Router();
const nodemailer = require("nodemailer");



const CreateTable = async (req, res) => {
    try {
        const { name, phone, person, reservationDate, reservationTime, email } = req.body;
        const userId = req.user.id;

        // Create a new booking entry
        const newBooking = new Tablebooking({
            name,
            phone,
            person,
            reservationDate,
            reservationTime,
            user: userId,
            email
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
            <h2 style="color: #ff9800; text-align: center; margin-bottom: 20px;">Hotel Golden View Restaurant</h2>
            <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>
            <p style="font-size: 16px;">Thank you for choosing <strong style="color: #ffb74d;">Hotel Golden View Restaurant</strong></p>
            <p style="font-size: 16px;">We're delighted to confirm your reservation at <strong style="color: #ffa726;">Hotel Golden View</strong> for:</p>
            <ul style="list-style-type: none; padding: 0; font-size: 16px; color: #333;">
              <li><strong style="color: #ff9800;">Date:</strong> ${reservationDate}</li>
              <li><strong style="color: #ff9800;">Time:</strong> ${reservationTime}</li>
              <li><strong style="color: #ff9800;">Guests:</strong> ${person}</li>
              <li style="margin-top: 10px;"><strong style="color: #ff9800;"></strong> <img src="https://drive.google.com/uc?id=1Yi-smOiAh1NweOe04gDaLQSYYqX4Rq9m" alt="Golden Hotel" style="width: 100px; height: auto; display: block; margin-top: 10px;"></li>
            </ul>
            <p style="font-size: 16px;">We look forward to welcoming you for a wonderful dining experience. Should you have any special requests or dietary requirements, please feel free to let us know in advance.</p>
            <p style="margin-top: 20px; font-size: 16px;">See you soon!</p>
            <p style="color: #ff9800; font-weight: bold; font-size: 16px; text-align: center;">Golden View Restaurant Team</p>
          </div>
        `;

        // Send the email
        const info = await transporter.sendMail({
            from: '"Golden View Restaurant" <nigamsuryansh921@gmail.com>',
            to: email,
            subject: "Reservation Confirmation - Hotel Golden View Restaurant",
            html: emailContent
        });

        console.log("Confirmation email sent: %s", info.messageId);

        // Respond with success
        res.status(201).json({
            message: "Table booked successfully, and confirmation email sent",
            data: newBooking
        });

    } catch (error) {
        console.error('Error creating reservation:', error);

        // Respond with error
        res.status(500).json({
            message: "Failed to book table",
            error: error.message
        });
    }
};

// Get All Bookings for a User
const AllBooking=  async (req, res) => {
    try {
        const bookings = await Tablebooking.find();
        res.status(200).json({ data: bookings });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve bookings", error });
    }
};

// Update a Booking
const UpdateBooking = async (req, res) => {
    try {
        const userId = req.userId;
        const bookingId = req.params.id;
        const updateData = req.body;

        const updatedBooking = await Tablebooking.findOneAndUpdate(
            { _id: bookingId, user: userId },
            updateData,
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found or unauthorized" });
        }

        res.status(200).json({ message: "Booking updated successfully", data: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: "Failed to update booking", error });
    }
};

// Delete a Booking
const DeleteBooking = async (req, res) => {
    try {
        const userId = req.userId;
        const bookingId = req.params.id;

        const deletedBooking = await Tablebooking.findOneAndDelete({
            _id: bookingId,
            user: userId
        });

        if (!deletedBooking) {
            return res.status(404).json({ message: "Booking not found or unauthorized" });
        }

        res.status(200).json({ message: "Booking deleted successfully", data: deletedBooking });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete booking", error });
    }
};

module.exports = {
    CreateTable,
    AllBooking,
    UpdateBooking,
    DeleteBooking
};