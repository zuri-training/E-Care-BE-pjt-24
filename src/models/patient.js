const mongoose = require('mongoose');

const { Schema } = mongoose;

const patientSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  image: {
    type: String,
  },
  dob: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Patient', patientSchema);
