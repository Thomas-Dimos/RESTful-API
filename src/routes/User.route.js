const express = require('express');
const router = express.Router();
const User_controller = require('../controllers/User.controller');
const Authentication_controller = require('../controllers/Authentication.controller');
const Event_controller = require('../controllers/Event.controller');

router.post('/sign-up',[User_controller.checkIfUserExists,User_controller.signup]);
router.post('/log-in',User_controller.login);
router.get('/refresh',Authentication_controller.refreshToken);
router.get('/Events',[Authentication_controller.isAuthenticated,Event_controller.index]);
router.post('/Events/new',[Authentication_controller.isAuthenticated,Event_controller.new]);
router.post('/Events/sync',[Authentication_controller.isAuthenticated,Event_controller.newSync]);
router.get('/Events/QR',[Authentication_controller.isAuthenticated,Event_controller.getEvents]);
router.get('/Events/Beacon',[Authentication_controller.isAuthenticated,Event_controller.getEvents]);
module.exports = router;