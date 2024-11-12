const mongoose = require("mongoose");

const Booking = mongoose.model('Booking',{
    houseNo:{
        type:String,
        required:true,
    },
    locality:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    zipCode:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },
    mobile:{
        type:String,
        required:true,
    },
})

module.exports=Booking;