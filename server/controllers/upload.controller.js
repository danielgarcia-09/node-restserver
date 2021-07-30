
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

const UploadController = {};
 
UploadController.uploadFile = ( req, res ) => {
   
    let { tipo, id } = req.params;

    if( !req.files ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no hay ningun archivo seleccionado'
            }
        })
    }

    //? Tipos permitidos
    let tiposValidos = ['productos','usuarios'];

    if ( !tiposValidos.includes( tipo ) ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
                tipo
            }
        })
    }

    let archivo = req.files.archivo;
    let extension = archivo.name.split('.')[1];

    //? Extensiones permitidas
    const extensionesValidas = ['png','jpg','gif','jpeg'];

    if ( !extensionesValidas.includes( extension ) ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // * Cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if( err ) {
            return res.status(500).json({
                ok:false,
                err
            })
        }
        
        if( tipo === tiposValidos[0] ) {
            imagenProducto( id, res, nombreArchivo );
        }else {
            imagenUsuario( id, res, nombreArchivo );
        }
    })
}

const imagenUsuario = ( id, res, nombreArchivo ) => {

    Usuario.findById(id, (err, usuarioDB) => {

        if( err ) {
            borrarArchivo( 'usuarios', nombreArchivo );
            return res.status(500).json({
                ok: false,
                err
            })
        } 

        if( !usuarioDB ) {
            borrarArchivo( 'usuarios', nombreArchivo );
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

       borrarArchivo( 'usuarios', usuarioDB.img );

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })

    })

}

const imagenProducto = ( id, res, nombreArchivo ) => {

    Producto.findById(id, (err, productoDB) => {

        if( err ) {
            borrarArchivo('productos', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if( !productoDB ) {
            borrarArchivo('productos', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        borrarArchivo('productos', productoDB.img);

        productoDB.img = nombreArchivo;

        productoDB.save( (err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })
    })

}

const borrarArchivo = ( carpeta,img ) => {

    let pathImagen = path.resolve(__dirname, `../../uploads/${carpeta}/${ img }`)
    return fs.existsSync( pathImagen ) ? fs.unlinkSync( pathImagen ) : false;
}

module.exports = UploadController;