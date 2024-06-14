"use strict";

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports.handler = async (event, context, callback) => {
  try {
    const token = event.headers.authorization;
    const authorizationToken = jwt.verify(token, JWT_SECRET);
    const userId = authorizationToken.id;
    console.log("Allowed");
    return generateResponse(true, userId);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.log("TokenExpiredError");
      callback("Unauthorized");
    } else if (err.name === "JWTError") {
      console.log("JWTError");
      return generateResponse(false);
    } else {
      console.log(err.name);
      return generateResponse(false);
    }
  }
};

const generateResponse = (isAuthorized, userId) => {
  const response = {
    isAuthorized: isAuthorized,
    context: {
      userId: userId,
    },
  };
  return response;
};
