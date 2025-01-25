const express = require("express");
const app = express();
const dotenv = require('dotenv');


const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require('body-parser');
const { Domain } = require("domain");
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
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.render("my_template.ejs");
});

app.get("/booking", (req, res) => {
    res.render("booking.ejs");
})

app.get("/signin", (req, res) => {
    res.render("signin.ejs");
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


//    }
   
   
//     });
//     console.log("lineItems:", lineItems);

//     const session = await stripeGateway.checkout.sessions.create({
//         payment_method_type: ['card'],
//         mode: 'payment',
//         success_url: '${Domain}/success',
//         cancel_url: '${Domain}/cancel',

//         billing_adress_collection: "required",
       
//     });
//     });



//server start
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});