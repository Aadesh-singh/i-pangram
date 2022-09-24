const mongoose = require('mongoose');

//establish connection
mongoose.connect('mongodb://localhost/ipangram');

//connect to db
const db = mongoose.connection;

//handle error and bind console
db.on('error', console.error.bind(console, "Error connecting db"));

//log on successful completion
db.once('open', function(){
    console.log('Successful connected to database');
});