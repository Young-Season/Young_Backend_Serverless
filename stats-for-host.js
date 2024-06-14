"use strict";

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const User = require("./models/user");

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
    const total = hostUser.animal.reduce((sum, val) => sum + val, 0);

    if (total === 0) {
      return context.done(null, {
        status: 204,
        message: "No Result Yet",
        data: {
          image: "000",
        },
      });
    }

    let result = {};
    arrName.forEach((name, idx) => {
      const arr = hostUser[name];
      const first = Math.max(...arr);
      const firstIdx = arr.indexOf(first);
      const firstObj = {
        [name]: firstIdx,
        percent: Math.floor((first / total) * 100),
      };

      arr[firstIdx] = 0;
      const second = Math.max(...arr);
      const secondObj = {
        [name]: arr.indexOf(second),
        percent: Math.floor((second / total) * 100),
      };
      result[name] = [firstObj, secondObj];
    });

    return context.done(null, {
      status: 200,
      message: "Stats Result",
      data: result,
    });
  } catch (err) {
    return context.failed(err);
  }
};
