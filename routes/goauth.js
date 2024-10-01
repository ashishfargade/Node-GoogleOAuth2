import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import jwt from "jsonwebtoken";

import { g_client_id, g_client_secret, jwt_secret } from "../config.js";
import User from "../models/User.js";

const router = express.Router();

passport.use(
    new GoogleStrategy(
        {
            clientID: g_client_id,
            clientSecret: g_client_secret,
            callbackURL: "http://localhost:3000/user/goauth/callback",
            passReqToCallback: true,
        },

        async (request, accessToken, refreshToken, profile, done) => {
            try {
                // Check user exists
                let user = await User.findOne({ googleId: profile.id });

                // If not exists
                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                    });
                    await user.save();
                }

                // generate jwt
                const payload = {
                    user: {
                        id: user.id,
                    },
                };

                const token = jwt.sign(payload, jwt_secret, {
                    expiresIn: "1h",
                });
                return done(null, { user, token });
            } catch (err) {}
        }
    )
);

// @router GET user/goauth
// @desc google login
// @access Public
router.get(
    "/",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

// @router GET user/goauth/callback
// @desc google login callback
// @access Public
router.get(
    "/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        const { token } = req.user;
        res.json({ token });
    }
);

// Route for signing out (client-side removes JWT token)
router.get("/signout", (req, res) => {
    // Note: with JWT, the client will manage the token, not the server
    res.json({ message: "User signed out (remove token on client side)" });
});

export default router;