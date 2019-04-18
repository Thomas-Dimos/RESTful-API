const User = require('../models/User.model');

exports.index = function(req,res,next) {
    User.findOne({'_id': res.userID},'qrEvents', {$sort : {timeStamp:1}}
    ).exec(function (err,user){
        if(err){
            res.status(500).send('Couldn\'t find user');
            return;
        }
        if(req.path === '/Events'){
            res.qrEvents = user.qrEvents;
            next();
        }else{
                console.log(user);
                res.send(JSON.stringify(user.qrEvents,null,'\t'));
            
        }
        

    });
}

exports.new = function(req,res) {

    User.findById(res.userID).exec().then(function(user){
        let date = new Date(req.body.timeStamp);
        date.setHours((date.getHours()+2));
        user.qrEvents.push({
            timeStamp: date,
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
                return ;
            }
            res.send('QREvent successfully stored in database');
        });
    });
}
