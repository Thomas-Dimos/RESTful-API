//key must be saved somewhere localy to be secured

const User = require ('../models/User.model');
const jwt = require('jsonwebtoken');
const Encryption = require('../Encryption');

const AnotherPrivateKey = 'SuperSecretKeyForRefreshToken';
const privateKey = 'unbreakableKeyss';
const Encrypt = new Encryption();
const jwtExpirationTime = '1h';

exports.signup = async function(req,res){
    try{
        const encryptedPassword = await Encrypt.encrypt(req.body.password);
        const newUser = new User({
            username: req.body.username,
            password: encryptedPassword,
            beaconEvents: [],
            qrEvents: []
        });
        newUser.save((err) => {
            if(err){
                return err;
            }
            res.send('User registered succesfully');
        })
    }catch(err){
        console.log(err);
    }
}

exports.checkIfUserExists = async function(req,res,next){
    const user = await User.findOne({username: req.body.username}).exec();
    if(user){
        res.status(432).send('Username already exists try another one')
    }else{
        next();
    }
}

exports.login = async function(req,res){
    try{
        const user = await User.findOne({username: req.body.username}).exec();
        if(!user){
            res.status(403).send('Wrong Username or Password');
        }
        const decryptedPassword = await Encrypt.decrypt(user.password);
        if(decryptedPassword == req.body.password){
            try{
                const accessToken = await jwt.sign({userID: user._id},privateKey,{ expiresIn: jwtExpirationTime});
                const refreshToken = await jwt.sign({userID: user._id},AnotherPrivateKey);
                const tokens = {accessToken: accessToken, refreshToken: refreshToken};
                res.send(JSON.stringify(tokens,null,'\t'));
            }catch(err){
                console.log(err);
                res.status(499).send(err.message);
            }
        }else{
            res.status(401).send('Wrong Username or Password');
        }
        
    }catch (err){
        console.log(err);
        res.status(500).send('Unexpected internal server error');
    }
    
}