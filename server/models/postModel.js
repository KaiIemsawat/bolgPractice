const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
    {
        title: String,
        summary: String,
        content: String,
        cover: String, // ! -- for the file upload
        author: { type: Schema.Types.ObjectId, ref: "users" }, // ! <-- This "users" nned to match schema name in userModel
    },
    {
        timestamps: true,
    }
);

const PostModel = model("Post", PostSchema);
module.exports = PostModel;
