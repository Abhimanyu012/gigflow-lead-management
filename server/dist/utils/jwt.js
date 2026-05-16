"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
const jsonwebtoken_1 = require("jsonwebtoken");
const env_1 = require("../config/env");
function signJwt(payload, expiresIn) {
    const secret = env_1.env.JWT_SECRET;
    const options = { expiresIn: (expiresIn ?? env_1.env.JWT_EXPIRES_IN) };
    return (0, jsonwebtoken_1.sign)(payload, secret, options);
}
