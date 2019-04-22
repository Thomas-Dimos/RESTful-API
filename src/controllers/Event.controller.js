const User = require('../models/User.model');
const mongoose = require('mongoose');


exports.getEvents = function(req,res,next) {
    const userID = mongoose.Types.ObjectId(res.userID);
    if(req.path === 'Event/QR'){
        User.find({"_id": userID},{"Events.eventType" : "QREvent"}).exec(function (err,qrEvents){
            if(err){
                res.status(500).send('Unexpected Internal Error');
                return;
            }
            res.send(JSON.stringify(qrEvents,null,'\t'));
        });
    }else if (req.path === 'Event/Beacon'){
        User.find({"_id": userID},{"Events.eventType" : "BeaconEvent"}).exec(function (err,beaconEvents){
            if(err){
                res.status(500).send('Couldn\'t find user');
                return;
            }
            res.send(JSON.stringify(beaconEvents,null,'\t'));
            
        });
    }
}

exports.index = function(req,res) {
    User.findOne({'_id': res.userID},'Events'
    ).exec(function (err,events){
        if(err){
            res.status(500).send('Unexpected Internal Error');
            return;
        }
        res.send(JSON.stringify(events,null,'\t'));
    });
}

exports.new = function(req,res) {
    
    User.findById(res.userID).exec().then(function(user){
        const date = new Date(req.body.timeStamp);
        date.setHours((date.getHours()+2));
        user.Events.push({
            timeStamp: date,
            location: {
                speed: req.body.location.speed,
                heading: req.body.location.heading,
                accuracy: req.body.location.accuracy,
                altitude: req.body.location.altitude,
                longitude: req.body.location.longitude,
                latitude: req.body.location.latitude
            },
            eventType: req.body.eventType,
            data: req.body.data
        });
        user.save((err) => {
            if(err){
                console.log(err);
                res.status(500).send('Unable to save to Database');
                return ;
            }
            res.send('Event successfully stored in database');
        });
    });
}

exports.newSync = function(req,res) {
    const date = new Date(req.body.timeStamp);
    User.update({"_id" : res.userID},{
        "$push": {
            "Events": {
                timeStamp: date,
                location: {
                    speed: req.body.location.speed,
                    heading: req.body.location.heading,
                    accuracy: req.body.location.accuracy,
                    altitude: req.body.location.altitude,
                    longitude: req.body.location.longitude,
                    latitude: req.body.location.latitude
                },
                eventType: req.body.eventType,
                data: req.body.data,
                "&sort": {timeStamp: -1}
            }
        }
    })
    .exec().then(function(user){
        user.save((err) => {
            if(err){
                console.log(err);
                res.status(500).send('Unable to save to Database');
                return;
            }
            res.send('Event successfully stored in database');
        });
    });
}