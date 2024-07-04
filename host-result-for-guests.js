"use strict"

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const User = require("./models/user");
const Description = require("./models/description");

const arrName = ["animal", "emoji", "color", "first", "now"];
  
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
  connectDB();
  try{
    const hostUser = await User.findOne({ id: hostId }).populate("friends");
    if(!hostUser)
      return {
        statusCode: "404",
        body: JSON.stringify({
          "message": "User Not Found",
        })
      };
  
    let firsts = {};
    arrName.forEach((name, idx) => {
      const arr = hostUser[name];
      const first = Math.max(...arr);
      firsts[name] = arr.indexOf(first);
    });

    const descData = await Description.findOne({ result: `${firsts["first"]}${firsts["now"]}` });

    return {
      statusCode: 200,
      body: JSON.stringify({
        "message": "Host result for Guests",
        "hostId": String(hostUser.id),
        "hostName": hostUser.name,
        "data": {
          "image": `${firsts["color"]}${firsts["emoji"]}${firsts["animal"]}`,
          "title": descData.title,
          "first": descData.first,
          "now": descData.now,
        }
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