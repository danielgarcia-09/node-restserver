const Categoria = require('../models/categoria');

const _ = require('underscore');

let CategoriaController = {}

CategoriaController.getAll = (req, res) => {

    Categoria.find({})
             .populate('usuario', 'nombre email')
             .sort('descripcion')
             .exec( (err, categorias) => {
        if( err ) {
            return res.status(400).json({ ok: false, err })
        } 

        res.status(200).json({
            ok: true,
            categorias
        })
    })

}

CategoriaController.getById = (req, res) => {

    let { id } = req.params;

    Categoria.findById(id, (err, categoria) => {
        if( err ) {
            return res.status(400).json({ ok: false, err })
        } 

        res.status(200).json({
            ok: true,
            categoria: _.pick(categoria, ['_id','descripcion'])
        })
    })

}

CategoriaController.create = (req, res) => {

    let { descripcion } = req.body;
    let { usuario } = req;

    let categoria = new Categoria({
        descripcion: descripcion,
        usuario: usuario
    });

    categoria.save( (err, categoriaDB) => {
        if( err ) {
            return res.status(400).json({ ok: false, err })
        } 

        if( !categoriaDB ) {
            return res.status(406).json({ ok: false, err })
        } 

        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        })
    })
}

CategoriaController.update = (req, res) => {
    let { id } = req.params;
    let { descripcion } = req.body;
    let { _id } = req.usuario;

    Categoria.findByIdAndUpdate(id, {descripcion: descripcion}, {new: true, runValidators: true}, (err, categoriaDB) => {

        if( err ) {
            return res.status(500).json({ ok: false, err });
        } 
        if( !categoriaDB ) {
            return res.status(406).json({ ok: false, err })
        } 

        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });

        
    });
}

CategoriaController.delete = (req, res) => {

    let { id } = req.params;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if( err ) {
            return res.status(500).json({ ok: false, err });
        } 

        if( !categoriaDB ) {
            return res.status(400).json({ ok: false, err })
        } 

        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        }); 
    })

}

module.exports = CategoriaController;