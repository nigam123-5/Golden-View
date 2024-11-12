const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true  // removes extra spaces
  },
  email: {
    type: String,
    required: true,
    unique: true,  // ensures email is unique in the database
    trim: true,
    lowercase: true,  // ensures email is always in lowercase
    match: [/.+@.+\..+/, 'Please enter a valid email address']  // validates email format
  },
  password: {
    type: String,
    required: true,
    minlength: 6  // password should be at least 6 characters
  },
  phoneNumber: {
    type: String,
    required: false,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']  // validates phone format
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
