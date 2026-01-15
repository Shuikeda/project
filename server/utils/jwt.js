import jwt from "jsonwebtoken";

const SECRET = "chat-secret-key";
const EXPIRES_IN = "1h";

export function createToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token) {
    return jwt.verify(token, SECRET);
}
