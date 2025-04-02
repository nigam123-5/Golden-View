const mongoose = require('mongoose');

const TablebookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  person: {
    type: Number,
    required: true,
    min: 1
  },
  reservationDate: {
    type: Date,
    required: true
  },
  reservationTime: {
    type: String,
    required: true,
    enum: [
      "10:00 am", "11:00 am", "12:00 pm", "01:00 pm", "02:00 pm", "03:00 pm",
      "04:00 pm", "05:00 pm", "06:00 pm", "07:00 pm", "08:00 pm", "09:00 pm", "10:00 pm"
    ]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        // Simple regex for validating email addresses
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  }
}, { timestamps: true });


const Tablebooking = mongoose.model('Tablebooking', TablebookingSchema);

module.exports = Tablebooking;