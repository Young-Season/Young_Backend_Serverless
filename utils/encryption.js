"use strict";

const crypto = require("crypto");
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

const encrypt = async (input) => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    ENCRYPTION_KEY,
    Buffer.alloc(16)
  );
  let encrypted = cipher.update(`${input}`, "utf8", "hex");
  encrypted += cipher.final("hex").slice(0, 16);
  return encrypted;
};

module.exports = encrypt;
