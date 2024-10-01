import mongoose from "mongoose";

import { mongo_uri } from "./config.js";

export const connectDB = async() => {
    try {
        await mongoose.connect(mongo_uri);
        console.log("Connection to mongo success");
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}