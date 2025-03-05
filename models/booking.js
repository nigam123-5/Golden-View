const mongoose = require("mongoose");

const Booking = mongoose.model('Booking', {
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    email: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    zipCode: {
        type: Number,
        required: true,
    },
    cancellation: { 
        type: Boolean, 
        default: false 
    },
    checkIn: {
        status: {
            type: String,
            enum: ['pending', 'checkedIn'],
            default: 'pending'
        },
        date: {
            type: Date
        }
    },
    roomNo: { 
        type: Number,
    },
    checkOut: {
        status: {
            type: String,
            enum: ['pending', 'checkedOut'],
            default: 'pending'
        },
        date: {
            type: Date
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    pyment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = Booking;