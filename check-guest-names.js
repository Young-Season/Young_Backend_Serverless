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
  const hostId =  event.queryStringParameters.hostId;
  if(typeof hostId == "undefined" || hostId == "" || hostId == null)
    return {
      statusCode: "400",
      body: JSON.stringify({
        "message": "Bad Request",
      })
    };

  connectDB();
  
  try{
    const hostUser = await User.findOne({ id: hostId }).populate("friends");
    if (!hostUser)
      return {
        statusCode: "404",
        body: JSON.stringify({
          "message": "User Not Found",
        })
      };
      
    return {
      statusCode: "200",
      body: JSON.stringify({
        "message": "Host name for Landing Page",
        "hostName": hostUser.name,
      })
    };
    
  } catch(err){
    console.log(err);
    return {
      statusCode: "400",
      body: JSON.stringify({
        "message": "Bad Request",
      })
    };
  }
  
};