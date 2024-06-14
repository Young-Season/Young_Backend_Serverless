"use strict";

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

let connection = null;

const connectDB = () => {
  if (connection && mongoose.connection.readyState === 1) return;
  mongoose.connect(MONGO_URI, {}).then((conn) => {
    connection = conn;
  });
};

module.exports.handler = async (event, context) => {
  const userId = event.body.id;
  const userName = event.body.name;
  if (
    typeof userId == "undefined" ||
    userId == "" ||
    userId == null ||
    typeof userName == "undefined" ||
    userName == "" ||
    userName == null
  )
    return context.done(null, { status: 400, message: "Bad Request" });
  connectDB();

  try {
    const existingUser = await User.findOne({ id: userId }).populate("friends");
    if (existingUser) {
      return context.done(null, { status: 409, message: "Duplicated User" });
    } else {
      const zeroArray = Array(9).fill(0);
      const newUser = await User.create({
        id: userId,
        name: userName,
        animal: zeroArray,
        emoji: zeroArray,
        color: zeroArray,
        first: zeroArray,
        now: zeroArray,
      });

      if (newUser) {
        const token = jwt.sign(
          {
            id: userId,
            name: userName,
          },
          JWT_SECRET,
          {
            expiresIn: "30m",
          }
        );

        return context.done(null, {
          status: 201,
          message: "New User Created",
          data: {
            id: userId,
            name: userName,
            token: token,
          },
        });
      } else {
        throw new Error("Failed to Create New User");
      }
    }
  } catch (err) {
    return context.fail(err);
  }
};
