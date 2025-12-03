const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  experience: { type: Number, required: true },
  phone: { type: String },
  specialization: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);