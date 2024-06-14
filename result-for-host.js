"use strict";

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const User = require("./models/user");
const Description = require("./models/description");

const arrName = ["animal", "emoji", "color", "first", "now"];

let connection = null;

const connectDB = () => {
  if (connection && mongoose.connection.readyState === 1) return;
  mongoose.connect(MONGO_URI, {}).then((conn) => {
    connection = conn;
  });
};

module.exports.handler = async (event, context) => {
  const hostId = event.pathParameters.hostId;
  const userId = event.requestContext.authorizer.lambda.userId;

  if (hostId != userId)
    return context.done(null, { status: 403, message: "User Not Allowed" });

  connectDB();

  try {
    const hostUser = await User.findOne({ id: hostId }).populate("friends");

    if (hostUser.friends.length === 0) {
      return context.done(null, {
        status: 204,
        message: "No Result Yet",
        data: {
          image: "000",
        },
      });
    }

    const guestData = hostUser.friends.map((friend) => ({
      id: friend._id,
      name: friend.name,
    }));

    let firsts = {};
    arrName.forEach((name, idx) => {
      const arr = hostUser[name];
      const first = Math.max(...arr);
      firsts[name] = arr.indexOf(first);
    });

    const image = `${firsts["color"]}${firsts["emoji"]}${firsts["animal"]}`;
    const descData = await Description.findOne({
      result: `${firsts["first"]}${firsts["now"]}`,
    });

    const result = {
      image: image,
      title: descData.title,
      first: descData.first,
      now: descData.now,
      guests: guestData,
    };

    return context.done(null, {
      status: 200,
      message: "User Results",
      data: result,
    });
  } catch (err) {
    return context.failed(err);
  }
};
