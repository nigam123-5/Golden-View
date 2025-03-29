const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true  
  },
  email: {
    type: String,
    required: true,
    // unique: true,  
    trim: true,
    lowercase: true,  
    match: [/.+@.+\..+/, 'Please enter a valid email address'] 
  },
  // password: {
  //   type: String,
  //   required: true,
  //   minlength: 6  
  // },
  phoneNumber: {
    type: String,
    required: false,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']  
  },
  age:{
    type:Number,
    requred:true
  },
bookings:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Booking"
}],
  createdAt: {
    type: Date,
    default: Date.now  // automatically sets the creation date
  }
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
