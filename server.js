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


const  roomRoutes = require('./Routes/roomRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');
const userRoutes = require('./Routes/userRoutes');

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

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

// Require booking routes
app.use('/api', bookingRoutes);
app.use('/api', roomRoutes);
app.use('/api', userRoutes);

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



app.get("/admin/signup", (req, res) => {
    res.render("admin/signup.ejs");
});

app.get("/admin/adminHome", (req, res) => {
    res.render("admin/adminHome.ejs");
});

app.get("/admin/addfood", (req, res) => {
    res.render("admin/addfood.ejs");
});

app.get("/admin/login", (req, res) => {
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

app.get("/admin/roomList", async(req, res) => {
    try {
        const rooms = await Room.find(); 
        res.render("admin/roomList", { rooms: rooms }); 
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).send("Error fetching room data"); 
    }
});

app.get("/admin/foodList", (req, res) => {
    res.render("admin/foodList.ejs");
});

app.get("/admin/bookingList", async (req, res) => {
    try {
        const bookings = await Booking.find().populate("room");
        const rooms = await Room.find();
        res.render("admin/bookingList.ejs", { bookings, rooms });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send("Error retrieving booking data.");
    }
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

app.get("/rooms/city/:city", async (req, res) => {
    try {
        const city = decodeURIComponent(req.params.city);
        console.log(city, "city");
        const rooms = await Room.find({ city: city });
        res.render("rooms.ejs", { rooms: rooms });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        console.error("Error details:", error.stack); 
        res.status(500).send("Error fetching room data");
    }
});

app.get("/guest_details/:id", async (req, res) => {
    const roomId = req.params.id;
    const apiKey = process.env.RAZORPAY_KEY_ID;
    const selectedRoom = await Room.findOne({ _id: roomId });

    if (!selectedRoom) {
        return res.status(404).send("Room not found");
    }

    res.render("guest_details.ejs", { room: selectedRoom, apiKey: apiKey });
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

app.get("/confirm_contact", (req, res) => {
    res.render("confirm_contact.ejs");
});

app.get("/payment", (req, res) => {
    const amount = 50000; // Example amount in paise (₹500)
    res.render("payment", { amount }); // Pass the amount to the EJS template
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
  const amount = 500; 
  res.render("payment", { amount });
});



// Booked route with email notification
app.post("/confirmation_page", async (req, res) => {
    const { name, phone, person, reservationDate, time, email } = req.body;
    const user = new User({
        name, phone, person, reservationDate, time, email
    })
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
                subject: "Confirmation from Hotel Golden View - Restaurant",
                html: `<p>Thank you for choosing  Golden View Restaurant !! 
                We're delighted to confirm your reservation for ${reservationDate} at ${time}. 
                We look forward to welcoming you for a wonderful dining experience. 
                Should you have any special requests or dietary requirements, please feel free to let us know in advance. See you soon !!</p>`
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        }

        main().catch(console.error);

        res.render("confirmation_page.ejs")
        console.log("Booked");
    } catch (err) {
        console.error('Error saving reservation:', err);
        res.status(500).send('Error submitting data');
    }

})


// Start the server
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});


