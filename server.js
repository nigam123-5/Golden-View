const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require('body-parser')
app.use(express.json());

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
    await mongoose.connect(MONGO_URL);
}

// //Basic API Create

// app.get("/", (req, res) => {
//     res.send("Hii, I am Suryansh");
//  });


// const userSchema = mongoose.Schema({
//     name: String,
//     phone: Number,
//     person: String,
//     reservationDate: String,
//     time: String,
//     email: String,
// })

// const User = mongoose.model("users", userSchema);


app.get("/", (req, res) => {
    res.render("my_template.ejs");
});

app.get("/booking", (req, res) => {
    res.render("booking.ejs");
})

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
                html: `<p>Thank you for choosing The Taj Hotel !! 
                We're delighted to confirm your reservation for ${reservationDate} at ${time}. We look forward to welcoming you for a wonderful dining experience. Should you have any special requests or dietary requirements, please feel free to let us know in advance. See you soon !!</p>`
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        }

        main().catch(console.error);

        res.render("booked.ejs")
        console.log("Booked");
    } catch (err) {
        console.error('Error saving reservation:', err);
        res.status(500).send('Error submitting data');
    }

})



app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});