import config from "../config/config.js";
import jwt from "jsonwebtoken";

export function createAccessToken(userId) {
  return jwt.sign(userId, config.ACCESS_TOKEN_SECRET, { expiresIn: config.ACCESS_TOKEN_EXPIRES });
}

export function verifyAccessToken(token) {
     return jwt.verify(token, config.ACCESS_TOKEN_SECRET);
}

export function createRefreshToken(userId) {
     return jwt.sign( userId , config.REFRESH_TOKEN_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRES });
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
}