"use strict";

const mongoose = require("mongoose");
const axios = require("axios");
const qs = require("qs");
const jwt = require("jsonwebtoken");
const encryptUtil = require("./utils/encryption");
const User = require("./models/user");

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const KAKAO_API_KEY = process.env.KAKAO_API_KEY;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;

let connection = null;

const connectDB = () => {
  if (connection && mongoose.connection.readyState === 1) return;
  mongoose.connect(MONGO_URI, {}).then((conn) => {
    connection = conn;
  });
};

module.exports.handler = async (event, context) => {
  connectDB();

  try {
    const code = event.body.code;
    if (typeof code == "undefined" || code == "" || code == null)
      return context.done(null, { status: 400, message: "Bad Request" });

    const kakaoToken = await axios({
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        grant_type: "authorization_code",
        client_id: KAKAO_API_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        code: code,
        client_secret: KAKAO_CLIENT_SECRET,
      }),
    });

    const kakaoUserInfo = await axios({
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${kakaoToken.data.access_token}`,
      },
    });

    const userId = encryptUtil.encrypt(kakaoUserInfo.data.id); // 카카오계정 식별자 암호화

    const user = await User.findOne({ id: userId }).populate("friends");
    if (user) {
      const token = jwt.sign(
        {
          id: userId,
          name: user.name,
        },
        JWT_SECRET,
        {
          expiresIn: "30m",
        }
      );

      return context.done(null, {
        status: 200,
        message: "Login Success",
        id: userId,
        hostName: user.name,
        token: token,
      });
    } else {
      return context.done(null, {
        status: 404,
        message: "Signup Required",
        id: userId,
      });
    }
  } catch (err) {
    return context.fail(err);
  }
};
