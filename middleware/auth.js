const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //Auth:Bearer TOKEN
        if (!token) {
            throw new Error("Authorization faield!");
        }
        const payload = jwt.verify(token, "secret_temp_key");
        req.userData = { userId: payload.userId, email: payload.email };
        next();


    } catch (err) {
        return next(new HttpError("Authorization failed", 401));
    }

};