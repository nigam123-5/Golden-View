const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    capacity: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    bedSize: {
        type: String,
        required: true,
    },
    wifi: {
        type: Boolean,
        default: true,
        required: true
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    zipCode: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    available: { 
        type: Boolean, 
        default: true 
    },
    roomNumbers: [{
        roomNo: {
            type: Number,
            required: true,
            unique: true
        },
        bookings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking"
        }],
        available: {
            type: Boolean,
            default: true,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now 
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

roomSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
