const mongoose = require("mongoose");

const Booking = mongoose.model('Booking',{
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']  
    },
    email:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
    },

    country:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    zipCode:{
        type:Number,
        required:true,
    },
    cancellation:{ 
        type: Boolean, 
        default: false 
    },
    checkIn:{ 
        type: Boolean, 
        default: false 
    },
    room:{ 
        type: Number,
    },
    checkOut:{ 
        type: Boolean, 
        default: false 
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    room:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
      },
    createdAt: {
        type: Date,
        default: Date.now 
      },
    
})

module.exports=Booking;