const express = require('express');
const router = express.Router();
const User_controller = require('../controllers/User.controller');
const BeaconEvent_controller = require('../controllers/BeaconEvent.controller');
const Authentication_controller = require('../controllers/Authentication.controller');
const QREvent_controller = require('../controllers/QREvent.controller');

router.post('/sign-up',[User_controller.checkIfUserExists,User_controller.signup]);
router.post('/log-in',User_controller.login);
router.get('/refresh',Authentication_controller.refreshToken);
router.get('/Events',[Authentication_controller.isAuthenticated,BeaconEvent_controller.index,QREvent_controller.index,User_controller.prepareEvents])

module.exports = router;