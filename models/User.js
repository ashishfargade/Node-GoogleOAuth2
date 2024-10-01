import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false // not req for google oauth
    },
    googleId: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('UserSchema', UserSchema);
export default User;