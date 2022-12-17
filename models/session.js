const Message = require('./Message');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    messages: [{ type: Object }],
    metaData: { type: String, required: true, ref: 'Message', default: "#general" },

});

module.exports = mongoose.model("Session", SessionSchema);