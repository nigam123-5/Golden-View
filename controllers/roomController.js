const Room = require('../models/room');


const createRoom = async (req, res) => {
    try {
        const { category, description, capacity, area, bedSize, wifi, city, address, zipCode, price, image, start, end } = req.body;

        if (!category || !description || !capacity || !area || !bedSize || !wifi || !city || !address || !zipCode || !price || !image || !start || !end) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        let roomNumbers = [];
        for (let i = start; i <= end; i++) {
            roomNumbers.push({ roomNo: i, bookings: [], available: true });
        }

        const newRoom = new Room({
            category,
            description,
            capacity,
            area,
            bedSize,
            wifi,
            city,
            address,
            zipCode,
            price,
            image,
            available: true,
            roomNumbers
        });

        await newRoom.save();

        res.status(201).json({ message: "Room created successfully!", room: newRoom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating room." });
    }
};

// Edit room route
 const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, description, capacity, area, bedSize, wifi, city, address, zipCode, price, image } = req.body;

        const room = await Room.findByIdAndUpdate(id, {
            category,
            description,
            capacity,
            area,
            bedSize,
            wifi,
            city,
            address,
            zipCode,
            price,
            image,
        }, { new: true });

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json({ message: "Room updated successfully", room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete room route
const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const room = await Room.findByIdAndDelete(id);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json({ message: "Room deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get all rooms route
const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();

        res.json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}; 


module.exports = { createRoom, updateRoom, deleteRoom, getAllRooms };