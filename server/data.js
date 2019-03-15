const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema(
  {
    id: Number,
    message: String
  },
  { timestamps: true },
);

module.exports = mongoose.model('data', DataSchema);
