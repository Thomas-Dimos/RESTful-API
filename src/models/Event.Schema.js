const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocationSchema = require('./LocationSchema');

const EventSchema = new Schema({
    timeStamp: {type: String,required: true},
    location: LocationSchema,
    //eventType: {type: String,required: true},
    data: {type: String, required: true}
});

module.exports = EventSchema;