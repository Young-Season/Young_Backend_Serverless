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
  const hostId = event.pathParameters.hostId;
  const userId = event.requestContext.authorizer.lambda.userId;
  let page = event.queryStringParameters.page;
  const pageSize = 6;

  if (hostId != userId)
    return context.done(null, { status: 403, message: "User Not Allowed" });

  connectDB();

  try {
    const hostUser = await User.findOne({ id: hostId }).populate("friends");

    if (hostUser.friends.length === 0) {
      return context.done(null, {
        status: 204,
        message: "No Result Yet",
      });
    }

    if (typeof page == "undefined" || page == "" || page == null) page = 1;
    else page = parseInt(page);

    const guestData = hostUser.friends.map((friend) => ({
      id: friend._id,
      name: friend.name,
    }));

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const pageData = guestData.slice(startIndex, endIndex);

    if (pageData.length === 0) {
      return context.done(null, {
        status: 204,
        message: "No results on Page",
        page: page,
        total: hostUser.friends.length,
      });
    }

    return context.done(null, {
      status: 200,
      message: "Guest List Result",
      guests: pageData,
      page: page,
      total: hostUser.friends.length,
    });
  } catch (err) {
    return context.failed(err);
  }
};
