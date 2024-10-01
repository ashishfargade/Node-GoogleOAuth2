import express, { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

import User from "../models/User.js";
import { jwt_secret } from "../config.js";

const router = Router();

// @route POST /user/new
// @desc REGISTER user
// @access PUBLIC
router.post(
    "/",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password should be min 8 characters").isLength({
            min: 8,
        }),
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        const {name, email, password} = req.body;

        try {

            // Check if user exists
            let user = await User.findOne({ email });
            if(user){
                return res.status(400).json({ errors: [{ msg: "User already exists" }] });
            }

            // Create user
            user = new User({
                name,
                email,
                password
            });

            //Encrypt pass
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            //Return jwt
            const payload = {
                user: {
                    id: user.id,
                }
            }

            jwt.sign(
                payload,
                jwt_secret,
                { expiresIn: 360000 },  // reduce time (seconds)
                (err, token) => {
                    if(err) throw err;
                    res.json({ token }); // if success returns the token for the session
                }
            )

        } catch (err) {
            console.log(err.message);
            res.status(500).send("server error");
        }

        console.log(req.body);
    }
);

export default router;
