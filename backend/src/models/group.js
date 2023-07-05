const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  members: {
    type: [String],
    required: true,
  },
  expenses: {
    type: [
      {
        payer: {
          type: String,
          required: true,
        },
        participants: {
          type: [String],
          required: true,
        },
        cost: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model('Group', groupSchema);
