"use strict";

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const User = require("./models/user");

let connection = null;

const connectDB = () => {
  if (connection && mongoose.connection.readyState === 1) return;
  mongoose.connect(MONGO_URI, {}).then((conn) => {
    connection = conn;
  });
};

module.exports.handler = async (event, context) => {
  const hostId = event.queryStringParameters.hostId;
  const guestName = event.queryStringParameters.guestName;
  if (
    typeof hostId == "undefined" ||
    hostId == "" ||
    hostId == null ||
    typeof guestName == "undefined" ||
    guestName == "" ||
    guestName == null
  )
    return context.done(null, { status: 400, message: "Bad Request" });

  connectDB();

  try {
    const hostUser = await User.findOne({ id: hostId }).populate("friends");
    if (!hostUser)
      return context.done(null, { status: 404, message: "User Not Found" });

    const guestNames = hostUser.friends.map((friend) => friend.name);
    if (guestNames.includes(guestName)) {
      return context.done(null, {
        status: 409,
        message: "Nickname Duplicated",
        name: guestName,
      });
    }

    return context.done(null, {
      status: 200,
      message: "Nickname Available",
      name: guestName,
    });
  } catch (err) {
    return context.fail(err);
  }
};
