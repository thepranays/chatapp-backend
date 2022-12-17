const jwt = require("jsonwebtoken");


module.exports = (token, next) => {
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

//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzM5NjQxY2E5ZjJlOGNhZTAyMzAyMzQiLCJlbWFpbCI6Imtld2lubGVlMTIzQGdtYWlsLmNvbSIsImlhdCI6MTY2NDcwNTU2NH0.oRDLqPfwktISPXJOmgRtWwYyoAlm4nPu_iVEXCP0W3c"
