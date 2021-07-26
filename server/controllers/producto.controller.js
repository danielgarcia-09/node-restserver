const Producto = require('../models/producto');

let ProductoController = {};

ProductoController.getAll = ( req, res ) => {

    let { desde, limite } = req.query;
    
    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(Number(desde) || 0)
        .limit(Number(limite) || 5)
        .exec( (err, productos) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.status(200).json({
                ok: true,
                productos
            })

        })
}

ProductoController.getById = ( req, res ) => {

    let { id } = req.params;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            producto: productoDB
        })
    })
}

ProductoController.buscarProducto = ( req, res ) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productos) => {

            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.status(200).json({
                ok: true,
                productos
            })

        })
}

ProductoController.create = ( req, res ) => {

    let { nombre, precioUni, descripcion, categoria } = req.body;

    let producto = new Producto({
        nombre: nombre,
        precioUni: precioUni,
        descripcion: descripcion,
        categoria: categoria,
        usuario: req.usuario._id
    });

    producto.save( (err, productoDB) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            producto: productoDB
        })

    })

}

ProductoController.update = ( req, res ) => {

    let { id } = req.params;
    let body = req.body

    Producto.findByIdAndUpdate(id, body, { new:true, runValidators: true }, (err, productoDB) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            producto: productoDB
        })
    })
}

ProductoController.delete = ( req, res ) => {
    
    let { id } = req.params;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new:true, runValidators: true }, (err, productoDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            producto: productoDB,
            message: 'Producto inactivo'
        })
    })
}

module.exports = ProductoController;