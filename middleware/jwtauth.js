import jwt from "jsonwebtoken";

import { jwt_secret } from "../config.js";

export default function jwtauth(req, res, next){
    const token = req.header('x-auth-token');

    // check if no token
    if(!token){
        console.log('no token');
        return res.status(401).json({ msg: 'No token, auth denied' });
    }

    // Decode token
    try {
        const decoded = jwt.verify(token, jwt_secret);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token' });
        console.log(err);
    }
}