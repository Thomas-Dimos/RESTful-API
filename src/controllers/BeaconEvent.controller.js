
const User = require('../models/User.model');

exports.index = function(req,res) {

    User.findById(res.userID).exec(function (err,user){
        if(err){
            res.status(500).send('Couldn\'t find user');
            return;
        }
        res.send(JSON.stringify(user.beaconEvents,null,'\t'));

    });

}

exports.new = function(req,res,next) {
    User.findById(res.userID).exec().then(function(user){
        user.beaconEvents.push({
            timeStamp: req.body.timeStamp,
            location: {
                speed: req.body.location.speed,
                heading: req.body.location.heading,
                accuracy: req.body.location.accuracy,
                altitude: req.body.location.altitude,
                longitude: req.body.location.longitude,
                latitude: req.body.location.latitude
            },
            data: req.body.data
        });
        user.save((err) => {
            if(err){
                console.log(err);
                res.status(500).send('Unable to save to Database');
                return;
            }
            res.send('BeaconEvent successfully stored in database');
        });
    });
}