const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({

    email: { type: String, required: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    atTime: { type: String, required: true },
    sessionId: { type: String, required: true, ref: "Session" }



});


module.exports = mongoose.model("Message", MessageSchema);