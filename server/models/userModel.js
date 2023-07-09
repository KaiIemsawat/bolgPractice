const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true, min: 3, unique: true },
    password: { type: String, required: true, min: 6 },
});

const UserModel = model("users", UserSchema);
module.exports = UserModel;
