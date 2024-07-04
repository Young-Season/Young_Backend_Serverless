"use strict"

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const User = require("./models/user");
  
let connection = null;

const connectDB = () => {
  if (connection && mongoose.connection.readyState === 1) return;
  mongoose.connect(MONGO_URI, { }).then(
    conn => {
      connection = conn;
    }
  );
};

module.exports.handler = async (event, context) => {

  const hostId = event.pathParameters.hostId;
  const guestId = event.pathParameters.guestId;
  const userId = event.requestContext.authorizer.lambda.userId;
  
  if(hostId != userId)
    return {
      statusCode: "403",
      body: JSON.stringify({
        "message": "User Not Allowed",
      })
    };

  connectDB();
  
  try{
    const hostUser = await User.findOne({ id: hostId }).populate("friends");
    const guestResult = hostUser.friends.filter((item) => item._id == guestId);
    
    if (guestResult.length == 0) 
      return {
        statusCode: "400",
        body: JSON.stringify({
          "message": "Bad Request",
        })
      };

    const guestData = {
      ...guestResult[0]._doc,
    };
    delete guestData._id;
    
    return {
      statusCode: "200",
      body: JSON.stringify({
        "message": "Guest Result",
        "data": guestData
      })
    };
    
  } catch (err) {
    console.log(err);
    return {
      statusCode: "400",
      body: JSON.stringify({
        "message": "Bad Request",
      })
    };
  }
  
};