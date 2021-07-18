
const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');


let UsuarioController = {};

UsuarioController.getAll = ( req, res ) => {

    let { desde, limite } = req.query;

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip( Number(desde) || 0 )
        .limit( Number(limite) || 5 )
        .exec( (err, usuarios) => {

            if( err ) {
                return res.status(400).json( { ok: false, err } )
            } 

            Usuario.estimatedDocumentCount({ estado: true },  (err, count) => {
                res.status(200).json( {
                    ok: true, 
                    usuarios: usuarios,
                    cuantos: count 
                } );
            })
            
         
    });

}

UsuarioController.createUsuario = (req, res) => {

    const {nombre, email, password, img, role, estado, google} = req.body; 
    let usuario = new Usuario({
        nombre: nombre,
        email: email,
        password: bcrypt.hashSync(password, 10),
        role: role,
    });

    usuario.save( (err, usuarioDB) => {

        if( err ) {
            return res.status(400).json( { ok: false, err } )
        } else {
            // usuarioDB.password = null;
            res.status(201).json({usuarioDB});
        }
    });
   
}
 
UsuarioController.updateUsuario = (req, res) => {

    const { id } = req.params;
    const body = _.pick( req.body, ['nombre','email','img','role', 'estado'] );

    Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if( err ) {
           return res.status(404).json( { ok: false, err } )
        }
        res.status(200).json( { ok: true, usuario: usuarioDB } );
        
    })
    

  
}

UsuarioController.deleteUsuario = (req, res) => {
    
    const { id } = req.params;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => {
        if( err ) {
            return res.status(404).json( { ok: false, err } )
        }

        if( usuarioBorrado === null) {
            return res.status(404).json( {
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            } )
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })

    })

}



module.exports = UsuarioController;