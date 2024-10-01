import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from 'express-validator';

import { jwt_secret } from "../config.js";
import  jwtauth  from "../middleware/jwtauth.js"
import User from "../models/User.js";

const router = express.Router();

// @router GET /user/auth
// @desc TEST route
// @access Private
router.get("/", jwtauth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

// @router POST /user/auth
// @desc Authenticate user and get token
// @access Public
router.post(
    "/",

    [
        check("email", "Please include a valid email address").isEmail(),
        check("password", "Password Required").exists()
    ],

    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {

            // Check user exists
            let user = await User.findOne({ email })
            if(!user){
                return res.status(400).json({ errors: [{msg: "Invalid Credentials"}] });
            }

            // Verify pass
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(400).json({errors: [{ msg: "Invalid Credentials" }]});
            }

            // Return jwt
            const payload = {
                user: {
                    id: user.id,
                }
            }

            jwt.sign(
                payload, jwt_secret, 
                { expiresIn: 360000 },
                (err, token) => {
                    res.json({token});
                }    
            )

        } catch (err) {
            console.log(err.message);
            res.send(500).send("server Error");
        }

        console.log(req.body);
    }
);

export default router;