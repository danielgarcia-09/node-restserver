const express = require('express');

const router = express.Router();

const { validarToken, verificaAdmin_Role, verificaTokenImg } = require('../middlewares/autorizacion');

const { LoginController, UsuarioController, CategoriaController, ProductoController, UploadController, ImagenController } = require('../controllers/index');

// ? Usuario Routes
router.get('/usuario', validarToken, UsuarioController.getAll);
router.post('/usuario', [validarToken,verificaAdmin_Role], UsuarioController.createUsuario);
router.put('/usuario/:id', [validarToken,verificaAdmin_Role], UsuarioController.updateUsuario);
router.delete('/usuario/:id', [validarToken,verificaAdmin_Role], UsuarioController.deleteUsuario);

// * ---------------------------------------------------------------------

// ? Login Routes
router.post('/login', LoginController.login);
router.post('/google', LoginController.google);


// * ---------------------------------------------------------------------

//todo Categoria Routes
router.get('/categoria', validarToken, CategoriaController.getAll);
router.get('/categoria/:id', validarToken, CategoriaController.getById);
router.post('/categoria',validarToken, CategoriaController.create);
router.patch('/categoria/:id', validarToken, CategoriaController.update);
router.delete('/categoria/:id', [validarToken,verificaAdmin_Role], CategoriaController.delete);

// * ---------------------------------------------------------------------

//! Producto Routes
router.get('/producto', validarToken, ProductoController.getAll);
router.get('/producto/:id', validarToken, ProductoController.getById);
router.get('/producto/buscar/:termino', validarToken, ProductoController.buscarProducto);
router.post('/producto', validarToken, ProductoController.create);
router.put('/producto/:id', validarToken, ProductoController.update)
router.delete('/producto/:id', validarToken, ProductoController.delete)


// * ---------------------------------------------------------------------

// * Upload Files Routes
router.put('/upload/:tipo/:id', validarToken, UploadController.uploadFile);

// * ---------------------------------------------------------------------

//? Imagen Routes
router.get('/imagen/:tipo/:img', verificaTokenImg, ImagenController.getImagen);

module.exports = router;