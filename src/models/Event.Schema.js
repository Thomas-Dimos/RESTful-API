const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocationSchema = require('./LocationSchema');

const EventSchema = new Schema({
    timeStamp: {type: Date,required: true},
    location: LocationSchema,
    eventType: {type: String,required: true},
    data: {type: String, required: true}
},{_id: false});

module.exports = EventSchema;