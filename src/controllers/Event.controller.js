const User = require('../models/User.model');
const mongoose = require('mongoose');

//BUG WITH DATES.FOR SOME REASON PARSING THE TIMESTAMP GIVES WRONG HOUR

exports.getEvents = function(req,res) {
    const userID = mongoose.Types.ObjectId(res.userID);
    let eventType;
    if(req.path === '/Events/QR'){
        eventType = 'QREvent';
    }else{
        eventType = 'BeaconEvent';
    }
    User.aggregate([
        {
            "$match": {"_id": userID}
        },
            {
            "$project": {
                "Events": {
                    "$filter": {
                        input: "$Events",
                        as: "event",
                        cond: {"$eq": ["$$event.eventType", eventType]}
                    }
                }
            }
        }
    ]).exec(function (err,result){
    if(err){
        console.log(err);
        res.status(500).send('Unexpected Internal Error');
        return;
    }
    res.send(JSON.stringify(result[0].Events,null,'\t'));
});
   
}

exports.index = function(req,res) {
    const userID = mongoose.Types.ObjectId(res.userID);
    User.findOne({'_id': userID}
    ).exec(function (err,result){
        if(err){
            res.status(500).send('Unexpected Internal Error');
            return;
        }

        res.send(JSON.stringify(result.Events,null,'\t'));
    });
}

exports.new = function(req,res) {
    User.findById(res.userID).exec().then(function(user){
        const date = new Date(req.body.timeStamp);
        date.setHours((date.getHours()+3));
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
               // console.log(err);
                res.status(500).send('Unable to save to Database');
                return ;
            }
            res.send('Event successfully stored in database');
        });
    });
}

exports.newSync = function(req,res) {
    const date = new Date(req.body.timeStamp);
    date.setHours((date.getHours()+3));
    User.updateOne(
        {"_id" : res.userID},
        {"$push": {
            "Events": {
                "$each": [{timeStamp: date,
                    location: {
                        speed: req.body.location.speed,
                        heading: req.body.location.heading,
                        accuracy: req.body.location.accuracy,
                        altitude: req.body.location.altitude,
                        longitude: req.body.location.longitude,
                        latitude: req.body.location.latitude
                    },
                    "eventType": req.body.eventType,
                    "data": req.body.data}],
                "$sort": {timeStamp: 1}
            },
            
        }
    },function(err,doc){
        if(err){
            console.log(err);
            res.status(500).send('Unable to save to Database');
            return;
        }else{
            res.send('Event successfully stored in database');
        }
    });
}