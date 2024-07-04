"use strict"

const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const User = require("./models/user");

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
    const total = hostUser.animal.reduce((sum, val) => sum + val, 0);

    if (total === 0) 
      return {
        statusCode: "204",
        body: JSON.stringify({
          "message" : "No Result Yet",
        })
      };
	  
	  
	  let result = {};
    arrName.forEach((name, idx) => {
      const arr = hostUser[name];
      const first = Math.max(...arr);
      const firstIdx = arr.indexOf(first);
      const firstObj = {
        index: firstIdx,
        percent: Math.floor((first / total) * 100),
      };

      arr[firstIdx] = 0;
      const second = Math.max(...arr);
      const secondObj = {
        index: arr.indexOf(second),
        percent: Math.floor((second / total) * 100),
      };
      result[name] = [firstObj, secondObj];
    });

	  return {
      statusCode: "200",
      body: JSON.stringify({
        "message": "Stats Result",
        "data" : result
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
