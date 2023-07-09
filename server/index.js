// import express from "express";
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/userModel.js");
const PostModel = require("./models/postModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs"); // to access file in device

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(`${__dirname}/uploads`)); // to get to the folder needed for image

// ! important to follow strigly follow the path. Be aware of '/'
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

mongoose.connect(
    "mongodb+srv://kaiiemsawat:Kinkin3710@cluster0.1zbqnov.mongodb.net/booking?retryWrites=true&w=majority"
);

const jwtSecret = "fsagfgre0909786fgl33kdwddaqa";

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const userData = await UserModel.create({
            username,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        });
        res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const userData = await UserModel.findOne({ username });
    console.log(`user data -> ${userData}`);
    if (!userData) {
        res.status(404).json({ message: "user not found" });
    } else if (userData) {
        const isPasswordOk = bcrypt.compareSync(password, userData.password);
        // console.log(`Inputpassword -> ${password}`);
        // console.log(`Data password -> ${userData.password}`);
        if (isPasswordOk) {
            jwt.sign(
                { username, id: userData._id },
                jwtSecret,
                {},
                (err, token) => {
                    if (err) throw err;
                    res.cookie("token", token).json({
                        id: userData._id,
                        username,
                    });
                }
            );
        } else {
            res.status(404).json("invalid credential");
        }
    }
});

app.get("/profile", (req, res) => {
    // ! To get token and convert to readable json
    const { token } = req.cookies;
    // console.log(req.cookies); // Raw jwt cookies
    jwt.verify(token, jwtSecret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
        // console.log(info); //  converted
    });
});

app.post("/logout", (req, res) => {
    res.cookie("token", "").json("ok");
});

// ! need multer -> 'npm i multer' in server side
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
    const { originalname, path } = req.file; // property name of files object
    const parts = originalname.split(".");
    const extension = parts[parts.length - 1];
    const newPath = `${path}.${extension}`;
    fs.renameSync(path, newPath);
    // res.json({ files: req.file }); // ! NOTE here

    // ! To get token and convert to readable json
    const { token } = req.cookies;
    // console.log(req.cookies); // Raw jwt cookies
    jwt.verify(token, jwtSecret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const postDoc = await PostModel.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
    });
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file; // property name of files object
        const parts = originalname.split(".");
        const extension = parts[parts.length - 1];
        newPath = `${path}.${extension}`;
        fs.renameSync(path, newPath);
    }
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await PostModel.findById(id);
        const isAuthor =
            JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json("you are not the author");
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc);
    });
});

app.get("/post", async (req, res) => {
    res.json(
        await PostModel.find()
            .populate("author", ["username"])
            .sort({ createdAt: -1 }) // sort by new to old
            .limit(20) // limited number of posts
    );
});

app.get("/post/:id", async (req, res) => {
    const { id } = req.params;
    const postDoc = await PostModel.findById(id).populate("author", [
        "username",
    ]);
    res.json(postDoc);
});

app.listen(8000);
