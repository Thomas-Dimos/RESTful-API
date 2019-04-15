const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EventSchema = require('./Event.Schema');

const UserSchema = new Schema ({
    username: {type: String,required: true},
    password: {type: String, required: true},
    beaconEvents: [EventSchema],
    qrEvents: [EventSchema]
});

module.exports = mongoose.model('User', UserSchema,'UserCollection');