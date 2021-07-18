require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes/index');


const app = express();

// * Middlewares
app.use(express.urlencoded( {extended: false} ));
app.use(express.json());

//  * Routes
app.use( routes );


// * Connecting to DB
mongoose.connect(process.env.URLDB,{ useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true }, (err,res)=> {

    if( err ) throw err;

    console.log('Base de datos ONLINE');

    // * Starting server
    app.listen(process.env.PORT, ()=> {
        console.log('Escuchando puerto ', process.env.PORT);
    })

})

