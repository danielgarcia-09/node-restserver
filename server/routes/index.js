const express = require('express');

const router = express.Router();

const { validarToken, verificaAdmin_Role } = require('../middlewares/autorizacion');

const { LoginController, UsuarioController, CategoriaController, ProductoController } = require('../controllers/index');

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



module.exports = router;