"use strict";

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const User = require("./models/user");
const Friend = require("./models/friend");
const Description = require("./models/description");

let connection = null;

const connectDB = () => {
  if (connection && mongoose.connection.readyState === 1) return;
  mongoose.connect(MONGO_URI, {}).then((conn) => {
    connection = conn;
  });
};

module.exports.handler = async (event, context) => {
  const { hostId, guestName, animal, emoji, color, first, now } = JSON.parse(
    event.body
  );
  if (
    typeof event.body == "undefined" ||
    event.body == "" ||
    event.body == null
  )
    return context.done(null, { status: 400, message: "Bad Request" });

  connectDB();

  try {
    const hostUser = await User.findOne({ id: hostId }).populate("friends");
    if (!hostUser)
      return context.done(null, { status: 404, message: "User Not Found" });

    const newFriend = await Friend.create({
      name: guestName,
      animal: animal,
      emoji: emoji,
      color: color,
      first: first,
      now: now,
    });

    const updatedUser = await User.findOneAndUpdate(
      { id: hostId },
      {
        $push: { friends: newFriend._id },
        $inc: {
          [`animal.${animal}`]: 1,
          [`emoji.${emoji}`]: 1,
          [`color.${color}`]: 1,
          [`first.${first}`]: 1,
          [`now.${now}`]: 1,
        },
      },
      { new: true }
    ).exec();

    if (!updatedUser)
      return context.done(null, { status: 400, message: "Bad Request" });

    const descData = await Description.findOne({ result: `${first}${now}` });

    return context.done(null, {
      status: 201,
      message: "Response Save Success",
      data: {
        hostId: String(hostId),
        hostName: hostUser.name,
        guestName: guestName,
        animal: animal,
        emoji: emoji,
        color: color,
        title: descData.title,
        first: descData.first,
        now: descData.now,
      },
    });
  } catch (err) {
    return context.fail(err);
  }
};
