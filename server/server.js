require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const fileUpload = require('express-fileupload');
const path = require('path');

const routes = require('./routes/index');

const app = express();

// * Middlewares
app.use(express.urlencoded( {extended: false} ));
app.use(express.json());

// * Default options to select files
app.use( fileUpload() );

// * Default view
app.use( express.static( path.resolve(__dirname, '../public') ) );


//  * Routes
app.use( routes );


// * Connecting to DB
mongoose.connect(process.env.URLDB,{ useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true }, (err,res)=> {

    if( err ) throw err;

    console.log('Base de datos ONLINE');

    // * Starting server
    app.listen(process.env.PORT, ()=> {
        console.log(`http://localhost:${process.env.PORT}`);
    })

})

