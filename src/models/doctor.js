const mongoose = require('mongoose');

const { Schema } = mongoose;

const doctorSchema = new Schema({
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
  licenseNumber: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  mobile: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['doctor', 'nurse'],
    required: true,
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);
