
const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const Session = require("../models/session");
const session = require('../models/session');


let user;

const findUserById = async (req, res, next) => {
    const userId = req.body.userId;
    console.log(userId);

    try {

        user = await User.findById(userId, '-password');


    } catch (err) {
        return next(new HttpError("Internal Server error", 500));
    }
    if (!user) {
        return next(new HttpError("User Not found", 404));
    }

    res.status(201).json({ user: user.toObject({ getters: true }) });
};

const getSessionMesssages = async (req, res, next) => {
    const sessionId = req.body.sessionId;
    let session;
    try {
        session = await Session.findOne({ metaData: sessionId });


    } catch (err) {
        return next(new HttpError("Backend errro", 502));
    }
    if (!session) {
        return next(new HttpError("Just Created Room, no Messages!", 404));
    }
    console.log(session.messages);
    res.status(201).json({ messagesList: session.messages });
};

const getAllUsers = async (req, res, next) => {
    let users = [];
    try {
        users = await User.find({});
        console.log(users);

    } catch (err) {
        return next(new HttpError("Backend error", 502));
    }
    res.status(201).json(users);
};


exports.findUserById = findUserById;
exports.getSessionMesssages = getSessionMesssages;
exports.getAllUsers = getAllUsers;