const express = require("express");
const app = express();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const Room = require('./models/room')
const Booking = require('./models/booking')
const JWT_SECRET = "GoldenHotel"

const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require('body-parser');

const { Domain } = require("domain");
const bcrypt = require('bcryptjs');




app.use(express.json());

// load variable

dotenv.config();

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "/public")));
const MONGO_URL = "mongodb+srv://nigamsuryansh11:eSTwBDp3cHp8N2mr@cluster0.sm9sa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});




async function main(){
    await mongoose.connect(MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 30000, socketTimeoutMS: 30000,});
}

app.get("/", (req, res) => {
    res.render("my_template.ejs");
});

app.get("/booking", (req, res) => {
    res.render("booking.ejs");
})

// app.get("/signin", (req, res) => {
//     res.render("signin.ejs");
// })

app.get("/menu", (req, res) => {
    res.render("menu.ejs");
})

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
})

app.get("/awards", (req, res) => {
    res.render("awards.ejs");
})

app.get("/rooms", (req, res) => {
    res.render("rooms.ejs");
})

app.get("/guest_details", (req, res) => {
    res.render("guest_details.ejs");
});

app.get("/hotels", (req, res) => {
    res.render("hotels.ejs");
})

app.get("/login", (req, res) => {
    res.render("login.ejs");
})



app.get("/maps", (req, res) => {
    res.render("maps.ejs");
})

app.get("/confirmation_page", (req, res) => {
    res.render("confirmation_page.ejs");
});


app.post("/booked", async (req, res) => {
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
                subject: "Confirmation from Taj Hotel",
                html: `<p>Thank you for choosing The  Hotel Golden view !! 
                We're delighted to confirm your reservation for ${reservationDate} at ${time}. We look forward to welcoming you for a wonderful dining experience. Should you have any special requests or dietary requirements, please feel free to let us know in advance. See you soon !!</p>`
            });

            console.log("Message sent: %s", info.messageId);
        }

        main().catch(console.error);

        res.render("booked.ejs")
        console.log("Booked");
    } catch (err) {
        console.error('Error saving reservation:', err);
        res.status(500).send('Error submitting data');
    }

})

//stripe

// let stripeGateway = stripe(process.env.stripe_api);
// app.post('/stripe-checkout', async (req,res) => {
//     const lineItems= req.body.items.map((item) => {
//         const unitAmount = parseInt = parseInt(item.price.replace(/[^0.9.-]+/g, "") * 100);
//    console.log('item-price', item.price);
//    console.log("unitAmount", unitAmount);

//    return {
//     price_data: 'usd',
//     product_data: {
//         name: item.title,
//     },
//     unit_amount: unitAmount,

// //creating endpoin signup authenticatiobn 
app.post('/signup',async(req,res)=>{

    try {
        const { name, email, password, phoneNumber, age } = req.body;
          
        if (!name || !email || !password || !phoneNumber || !age) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          age,
        });
        
    
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
          expiresIn: "10h",
        });
        const savedUser = await user.save();
        res.status(201).json({
          success:true,
          token,
          user:{...savedUser},
        });
      } catch (error) {
        console.error("Error creating user:", error); 
        res.status(500).json({
          message: "Error creating user",
          error: error.message || error,
        });
      }

})

// // user login endpoint
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

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
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


//room apis

// Function to add a new room
app.post('/room', async (req, res) => {
  try {
    // Extract room data from the request body
    const { category, description, capacity, area, bedSize, wifi, city, address, zipCode, price, image } = req.body;

    // Validate required fields
    if (!category || !description || !capacity || !area || !bedSize || !wifi || !city || !address || !zipCode || !price || !image) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    // Create a new room instance
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
      available: true, // Set availability to true by default
    });

    // Save the new room to the database
    await newRoom.save();

    // Send a success response with the created room
    return res.status(201).json({ message: "Room added successfully!", room: newRoom });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding room." });
  }
});


//edit room api 
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

//delete room api 
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


//get room 
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


//bookings apis
app.post('/booking/:room', async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, country, address, zipCode,date} = req.body;
    const userId = '67336425b3f8d02a7c2ac1db';
    const {room} = req.params // Get user ID from middleware

    // Validate input data
    if (!firstName || !lastName || !mobile || !email || !country || !address || !zipCode || !room ||!date) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // ... other validation checks, e.g., email format, phone number format, etc.

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
 // Update the room's booking array
 const updatedRoom = await Room.findByIdAndUpdate(room, { $push: { booking: newBooking._id } }, { new: true });

 if (!updatedRoom) {
   return res.status(404).json({ message: "Room not found" });
 }

 // Update user's booking array (optional)
 if (userId) {
   await User.findByIdAndUpdate(userId, { $push: { bookings: newBooking._id } }, { new: true });
 }

 res.status(201).json({ message: "Booking created successfully!", bookings: newBooking });
} catch (error) {
 console.error(error);
 res.status(500).json({ message:   
"Error creating booking." });
}
});


//upading booking api 
app.put('/booking/:id', async (req, res) => {
  try {
    const { id: bookingId } = req.params;
    const { firstName, lastName, mobile, email, country, address, zipCode, cancellation, checkIn, checkOut,date } = req.body;
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


//get booking by id 
app.get('/booking/:id', async (req, res) => {
  try {
    const { id: bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate('user room'); // Populate the user and room data

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error
  }
});


//cancel booking 
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

//delete booking 
app.delete('/booking/:id', async (req, res) => {
  try {
    const { id: bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const roomId = booking.room;
    const userId = booking.user;

    // Delete the booking
    await Booking.findByIdAndDelete(bookingId);

    // Remove the booking ID from the room's booking array
    await Room.findByIdAndUpdate(roomId, { $pull: { booking: bookingId } });

    // Remove the booking ID from the user's booking array (optional)
    if (userId) {
      await User.findByIdAndUpdate(userId, { $pull: { booking: bookingId } });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting booking." });
  }
});







//server start
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});