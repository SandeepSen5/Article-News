const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", 
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likestatus: { type: Boolean, default: false },
    dislikestatus: { type: Boolean, default: false },
    totallikes: { type: Number, required: true },
    totaldislikes: { type: Number, required: true },
}, { timestamps: true })

module.exports = mongoose.model("Likes", LikeSchema);
