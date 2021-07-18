
// * Puerto
process.env.PORT = process.env.PORT || 3000;

// * Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// * Caducidad token
process.env.CADUCIDAD = '1h';

// * SEED token
process.env.SEED = process.env.SEED || 'klk-wawawa';


// * Base de datos
let urlDB;

if( process.env.NODE_ENV === 'dev') {
   urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB;