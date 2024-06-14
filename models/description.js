const mongoose = require("mongoose");

const descriptionSchema = new mongoose.Schema(
  {
    result: {
      type: String,
      required: true,
      unique: true,
    },
    title: String,
    first: String,
    now: String,
  },
  {
    versionKey: false,
  }
);

const Description = mongoose.model("description", descriptionSchema);

module.exports = Description;
