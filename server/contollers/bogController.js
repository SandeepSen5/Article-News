const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const moment = require('moment');
const bcryptSalt = bcrypt.genSaltSync(10);
const User = require('../models/User');
const Post = require('../models/Post');
const Likes = require('../models/Likes');
const createError = require('../utils/createError');
const verifyToken = require("../middlewares/blogMiddleware");


exports.register = async (req, res, next) => {
    try {
        const { name, email, number, password, dob, cat, confirmpassword } = req.body;

        if (!cat) {
            return next(createError(400, "Fields cannot be Empty"));
        }

        const dobDate = moment(dob, 'YYYY-MM-DD', true);
        const tenYearsAgo = moment().subtract(10, 'years');

        if (!dobDate.isValid() || dobDate.isAfter(tenYearsAgo)) {
            return next(createError(400, "Age Should be Minimum 10 Years"));
        }

        if (confirmpassword !== password) {
            return next(createError(400, "Passwords Mismatch"));
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(createError(400, "User already registered"))
        }
        const newUser = await User.create({
            name,
            email,
            number,
            dob,
            cat,
            password: bcrypt.hashSync(password, bcryptSalt)
        });
        res.status(200).json(newUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

exports.login = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        console.log(email);
        const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

        if (isEmail) {
            var UserDoc = await User.findOne({ email });
        } else {
            var UserDoc = await User.findOne({ number: email });
        }

        console.log(UserDoc)
        if (!UserDoc) {
            return next(createError(400, "User Not Registered"));
        }
        if (UserDoc) {
            const passok = bcrypt.compareSync(password, UserDoc.password);
            if (passok) {
                jwt.sign({ email: UserDoc.email, name: UserDoc.name, id: UserDoc._id }, process.env.USER_JWTSECRET, {}, (err, tokens) => {
                    if (err) throw err;
                    res.cookie('Usertoken', tokens).json(UserDoc);
                })
            }
            else {
                return next(createError(400, "IncorrectPassword"))
            }
        }
        else {
            return next(createError(400, "User Not Registered"))
        }
    }
    catch (err) {
        next(err)
    }
}

exports.logout = (req, res, next) => {
    try {
        res.cookie('Usertoken', '').json(true);
    }
    catch (err) {
        next(err)
    }
}

exports.getUserDetails = async (req, res, next) => {
    try {
        console.log(req.userId);
        const userDoc = await User.findById(req.userId);
        res.status(200).json(userDoc);
    } catch (err) {
        next(err);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const { name, email, number, dob, cat } = req.body;
        console.log(dob);
        if (cat.length <= 0) {
            return next(createError(400, "All fields are required"));
        }
        const dobDate = moment(dob, 'YYYY-MM-DD', true);
        const tenYearsAgo = moment().subtract(10, 'years');

        if (!dobDate.isValid() || dobDate.isAfter(tenYearsAgo)) {
            return next(createError(400, "Age Should be Minimum 10 Years"));
        }

        if (!name || !email || !number || !dob) {
            return next(createError(400, "All fields are required"));
        }
        const userDoc = await User.findByIdAndUpdate(req.userId, {
            $set: {
                name: name, email: email, number: number, dob: dob,
                cat: cat
            }
        });
        res.status(200).json(userDoc);
    }
    catch (err) {
        next(err);
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        const { oldpassword, newpassword, confirmpassword } = req.body;

        if (!oldpassword || !newpassword || !confirmpassword) {
            return next(createError(400, "All fields are required"));
        }

        if (newpassword !== confirmpassword) {
            return next(createError(400, "Password Doesnt Match"))
        }

        if (newpassword.length < 4 || newpassword.length > 10) {
            return next(createError(400, "Password should be between 4 and 10 characters"));
        }

        const userDoc = await User.findById(req.userId);
        if (userDoc) {
            const passok = bcrypt.compareSync(oldpassword, userDoc.password);
            if (passok) {
                const userDocumts = await User.findByIdAndUpdate(req.userId, { $set: { password: bcrypt.hashSync(newpassword, bcryptSalt) } });
                res.status(200).json(userDocumts)
            }
            else {
                return next(createError(400, "IncorrectPassword"))
            }
        }
        else {
            return next(createError(400, "User Not Registered"))
        }

    } catch (err) {
        next(err);
    }
}

exports.photoUpload = async (req, res, next) => {
    try {
        console.log(req.file)
        const uploadedFile = [];
        const { filename } = req.file;
        uploadedFile.push(filename)
        return res.json(uploadedFile);
    }
    catch (err) {
        next(err);
    }
}

exports.createPost = async (req, res, next) => {
    try {
        const userid = req.userId;
        const { title, photo, desc, cat, name, id } = req.body;
        if (cat.length <= 0) {
            return next(createError(400, "All fields are required"));
        }
        if (!title || !photo || !desc || !name) {
            return next(createError(400, "All fields are required"));
        }

        if (id) {
            const postprev = await Post.findById(id);
            console.log(postprev, "watchhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
            if (postprev) {
                const postDocumts = await Post.findByIdAndUpdate(postprev._id, {
                    $set: {
                        title: title, photo: photo, desc: desc, username: name,
                        cat: cat, userid
                    }
                });
                console.log(postDocumts, "haiaiaiaiai");
                res.status(200).json(postDocumts)
            }
        }
        console.log(title, photo, desc, cat, name, "dlhbsdpjbh")
        const PostDoc = await Post.create({
            title, photo, desc, cat, username: name, userid
        })
        res.status(200).json(PostDoc);

    }
    catch (err) {
        next(err);
    }
}

exports.getPost = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        const userCategories = user.cat;
        console.log(userCategories);
        res.json(await Post.find({ cat: { $in: userCategories } }));
    }
    catch (err) {
        next(err);
    }
}

exports.getSinglepost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const postDoc = await Post.findById(id).populate({
            path: 'userid',
            model: 'User'
        })
        res.status(200).json(postDoc);
    }
    catch (err) {
        next(err);
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const postDoc = await Post.findByIdAndDelete(id)
        res.status(200).json(true);
    }
    catch (err) {
        next(err);
    }
}

exports.getMypost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const postDoc = await Post.find({ userid: req.userId });
        res.status(200).json(postDoc);
    }
    catch (err) {
        next(err);
    }
}

exports.likeMypost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const postDoc = await Post.findById(id).populate({
            path: 'userid',
            model: 'User'
        })

        const existingLike = await Likes.findOne({ post: postDoc._id, userid: req.userId });

        if (existingLike) {
            return next(createError(400, "You have already liked this Article"));
        }

        const likeDoc = await Likes.findOne({ post: postDoc._id });

        if (likeDoc) {
            likeDoc.totallikes += 1;
            likeDoc.likestatus = true;
            await likeDoc.save();
            res.status(200).json(true);
        } else {
            const newLikeDoc = new Likes({
                post: postDoc._id,
                title: postDoc.title,
                userid: req.userId,
                likestatus: true,
                dislikestatus: false,
                totallikes: 1,
                totaldislikes: 0
            });
            await newLikeDoc.save();
            return res.status(200).json(newLikeDoc);
        }
    }
    catch (err) {
        console.log(err);
        next(err);

    }
}

exports.dislikePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const postDoc = await Post.findById(id).populate({
            path: 'userid',
            model: 'User'
        })
        console.log(postDoc, "aaaaaaaaaaaaaaa");

        const existingLike = await Likes.findOne({ post: postDoc._id, userid: req.userId });

        if (existingLike) {
            return next(createError(400, "Already disliked the Article"));
        }

        const likeDoc = await Likes.findOne({ post: postDoc._id });

        if (likeDoc) {
            likeDoc.totallikes = likeDoc.totallikes - 1;
            likeDoc.likestatus = fals;
            await likeDoc.save();
            res.status(200).json(true);
        } else {
            const newLikeDoc = new Likes({
                post: postDoc._id,
                title: postDoc.title,
                userid: req.userId,
                likestatus: true,
                dislikestatus: false,
                totallikes: 0,
                totaldislikes: 1
            });
            await newLikeDoc.save();
            return res.status(200).json(newLikeDoc);
        }
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

exports.categoryPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id, "aaaaaaaaaaaaaaaaaaaaaaaaaaa")
        const catPost = await Post.find({ cat: id });
        return res.status(200).json(catPost);
    }
    catch (error) {
        console.log(error)
    }
}