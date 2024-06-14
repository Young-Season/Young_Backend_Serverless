const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    animal: Number,
    emoji: Number,
    color: Number,
    first: Number,
    now: Number,
  },
  {
    versionKey: false,
  }
);

const Friend = mongoose.model("friend", friendSchema);

module.exports = Friend;
