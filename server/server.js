require('./config/config');

const express = require('express');
const app = express();

// * Middlewares
app.use(express.urlencoded( {extended: false} ));
app.use(express.json());

app.get('/usuario', ( req, res ) => {
    res.json('get Usuario');
})

app.post('/usuario', (req, res)=> {

    const {nombre, edad, signo} = req.body;

    if(nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'el nombre es necesario'
        })
    } else {
        res.json({
            nombre,
            edad,
            signo
        });
    }
   
})

app.put('/usuario/:id', (req, res)=> {

    const { id } = req.params;

    res.json({
        id,
    });
})

app.delete('/usuario', (req, res)=> {
    res.json('delete Usuario');
})

app.listen(process.env.PORT, ()=> {
    console.log('Escuchando puerto ', process.env.PORT);
})