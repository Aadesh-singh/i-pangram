const express = require('express');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 8000;

// db
const mongoose = require('./config/mongoose');

// use static files 
app.use(express.static(path.join(__dirname, '/assets')));

// make the uplaods available for browser
app.use('/uploads', express.static(__dirname + '/uploads'));


app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,PUT,OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// body Parser
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());


// router
const router = require('./routes/index.routes');
app.use('/', router);

app.listen(port, function(err){
    if(err){
        console.log(`Error in loading the server: ${err}`);
        return;
    }
    console.log(`Server is up and running at port: ${port}`);
});