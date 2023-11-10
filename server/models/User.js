const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        default: "",
    },
    profilepic: {
        type: String,
        default: "",
    },
    dob: {
        type: Date,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    cat: [String],

}, { timestamps: true })

module.exports = mongoose.model("User", UserSchema);