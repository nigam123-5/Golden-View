const express = require("express");
const app = express();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const Room = require('./models/room');
const Booking = require('./models/booking');
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Razorpay = require("razorpay");
const cors = require("cors");
const nodemailer = require("nodemailer");
const rooms = require("./public/js/roomsData");
require('dotenv').config();

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));


// Set up EJS
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");




// MongoDB connection
const MONGO_URL = "mongodb+srv://nigamsuryansh11:eSTwBDp3cHp8N2mr@cluster0.sm9sa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Razorpay setup
const razorpay = new Razorpay({
    key_id: "rzp_test_z5oX2eRIpY5t0C", // Replace with your Razorpay key
    key_secret: "Oo2Lx0mjSCQRMYWWTFW4zfPR", // Replace with your Razorpay secret
});

// Routes
app.get("/", (req, res) => {
    res.render("my_template.ejs");
});

app.get("/booking", (req, res) => {
    res.render("booking.ejs");
});

app.get("/admin/dashboard", (req, res) => {
    res.render("admin/dashboard.ejs");
});

app.get("/admin/addfood", (req, res) => {
    res.render("admin/addfood.ejs");
});

app.get("/adminlogin", (req, res) => {
    res.render("admin/adminlogin.ejs");
});

app.get("/admin/addRoom", (req, res) => {
    res.render("admin/addRoom.ejs");
});

app.get("/menu", (req, res) => {
    res.render("menu.ejs");
});

app.get("/food", (req, res) => {
    res.render("food.ejs");
});

app.get("/admin/roomList", (req, res) => {
    res.render("admin/roomList.ejs");
});

app.get("/admin/foodList", (req, res) => {
    res.render("admin/foodList.ejs");
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.get("/payment", (req, res) => {
  res.render("payment.ejs");
});

app.get("/booknow", (req, res) => {
    res.render("booknow.ejs");
});

app.get("/awards", (req, res) => {
    res.render("awards.ejs");
});

app.get("/rooms", (req, res) => {
    console.log("Rooms Data:", rooms);
    res.render("rooms.ejs",{rooms});
});

app.get("/guest_details/:id", (req, res) => {
    const roomId = parseInt(req.params.id);
    const apiKey = process.env.RAZORPAY_KEY_ID;
    const selectedRoom = rooms.find(room => room.id === roomId);

    if (!selectedRoom) {
        return res.status(404).send("Room not found");
    }

    res.render("guest_details.ejs",{room: selectedRoom, apiKey:apiKey});
});

app.get("/hotels", (req, res) => {
    res.render("hotels.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/maps", (req, res) => {
    res.render("maps.ejs");
});

app.get("/confirmation_page", (req, res) => {
    res.render("confirmation_page.ejs");
});

app.get("/payment", (req, res) => {
    const amount = 50000; // Example amount in paise (₹500)
    res.render("payment", { amount }); // Pass the amount to the EJS template
});

// Booked route with email notification
app.post("/booked", async (req, res) => {
    const { name, phone, person, reservationDate, time, email } = req.body;
    const user = new User({
        name, phone, person, reservationDate, time, email
    });

    try {
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: "nigamsuryansh921@gmail.com",
                pass: "bwom agtl cuyl wmym",
            },
        });

        async function main() {
            const info = await transporter.sendMail({
                from: '<nigamsuryansh921@gmail.com>',
                to: email,
                subject: "Confirmation from Hotel Golden View",
                html: `<p>Thank you for choosing The Hotel Golden view !! 
                We're delighted to confirm your reservation for ${reservationDate} at ${time}. We look forward to welcoming you for a wonderful dining experience. Should you have any special requests or dietary requirements, please feel free to let us know in advance. See you soon !!</p>`
            });

            console.log("Message sent: %s", info.messageId);
        }

        main().catch(console.error);

        res.render("booked.ejs");
        console.log("Booked");
    } catch (err) {
        console.error('Error saving reservation:', err);
        res.status(500).send('Error submitting data');
    }
});

// User signup route
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phoneNumber, age } = req.body;

        if (!name || !email || !password || !phoneNumber || !age) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            age,
        });

        const token = jwt.sign({ id: user._id, email: user.email }, "GoldenHotel", {
            expiresIn: "10h",
        });

        const savedUser = await user.save();
        res.status(201).json({
            success: true,
            token,
            user: { ...savedUser },
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Error creating user",
            error: error.message || error,
        });
    }
});

// User login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, "GoldenHotel", {
            expiresIn: "1h",
        });

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, email: user.email, name: user.name },
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            message: "Error logging in user",
            error: error.message || error,
        });
    }
});

// Razorpay order creation
app.post("/create-razorpay-order", async (req, res) => {
    const { amount } = req.body;
    const options = {
        amount: amount * 100, // Amount in paise
        currency: "INR",
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order: ", error);
        res.status(500).json({ error: "Failed to create order" });
    }
});

app.get("/payment", (req, res) => {
  const amount = 500; // Ya jo bhi actual amount ho
  res.render("payment", { amount });
});


// Room management routes
app.post('/room', async (req, res) => {
    try {
        const { category, description, capacity, area, bedSize, wifi, city, address, zipCode, price, image } = req.body;

        if (!category || !description || !capacity || !area || !bedSize || !wifi || !city || !address || !zipCode || !price || !image) {
            return res.status(400).json({ message: "Please provide all required fields." });
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
        });

        await newRoom.save();
        return res.status(201).json({ message: "Room added successfully!", room: newRoom });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error adding room." });
    }
});

// Edit room route
app.put('/room/:id', async (req, res) => {
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
});

// Delete room route
app.delete('/room/:id', async (req, res) => {
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
});

// Get rooms by city
app.get('/room/:city', async (req, res) => {
    try {
        const { city } = req.params;

        const rooms = await Room.find({ city });

        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ message: "Rooms not found for the given city" });
        }

        res.json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Booking routes
app.post('/booking/:room', async (req, res) => {
    try {
        const { firstName, lastName, mobile, email, country, address, zipCode, date } = req.body;
        const userId = '67336425b3f8d02a7c2ac1db'; // Replace with actual user ID from JWT
        const { room } = req.params;

        if (!firstName || !lastName || !mobile || !email || !country || !address || !zipCode || !room || !date) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const newBooking = new Booking({
            firstName,
            lastName,
            mobile,
            email,
            date,
            country,
            address,
            zipCode,
            room,
            user: userId,
        });

        await newBooking.save();

        const updatedRoom = await Room.findByIdAndUpdate(room, { $push: { booking: newBooking._id } }, { new: true });

        if (!updatedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (userId) {
            await User.findByIdAndUpdate(userId, { $push: { bookings: newBooking._id } }, { new: true });
        }

        res.status(201).json({ message: "Booking created successfully!", bookings: newBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating booking." });
    }
});

// Update booking route
app.put('/booking/:id', async (req, res) => {
    try {
        const { id: bookingId } = req.params;
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
});

// Get booking by ID
app.get('/booking/:id', async (req, res) => {
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
});

// Cancel booking route
app.patch('/booking/:id', async (req, res) => {
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
});

// Delete booking route
app.delete('/booking/:id', async (req, res) => {
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
});

// Start the server
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});