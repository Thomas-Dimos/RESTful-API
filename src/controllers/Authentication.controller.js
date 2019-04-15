const jwt = require('jsonwebtoken');
const privateKey = 'unbreakableKeyss';
const AnotherPrivateKey = 'SuperSecretKeyForRefreshToken';
const jwtExpirationTime = '1h';

exports.isAuthenticated = async function(req,res,next){
    const token = req.headers['x-access-token'];
    try{
        const decodedToken = await jwt.verify(token,privateKey);
        res.userID = decodedToken.userID;
        next();
    }catch(err){
        console.log("Token Expired");
        res.status(498).send(err.name);
    }
}

exports.refreshToken = async function(req,res){
    console.log('Took a refresh request');
    const refreshToken = req.headers['x-access-token'];
    try{
        const decodedRefreshedToken = await jwt.verify(refreshToken,AnotherPrivateKey);
        const newAccessToken = await  jwt.sign({userID: decodedRefreshedToken.userID},privateKey,{ expiresIn: jwtExpirationTime});
        res.send(newAccessToken);
    }catch(err){
        res.status(499).send(err.message);
        console.log(err);
    }
}


