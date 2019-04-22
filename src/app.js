const express = require('express');
const bodyParser = require('body-parser');
const UserRouter = require('./routes/User.route');
const app = express();

//Setup Database
const mongoose = require('mongoose');
const dev_db_url = 'mongodb+srv://tomdimos:2651o534@testcluster-nkpba.mongodb.net/test?retryWrites=true';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.set('useNewUrlParser', true);
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/User',UserRouter);

const port = 9999;
app.listen(port,'0.0.0.0',()=>{
    console.log('Server is up and running on port number ' + port);
});