const express = require('express');

const router = express.Router();

const { validarToken, verificaAdmin_Role } = require('../middlewares/autorizacion');

const UsuarioController = require('../controllers/usuario.controller');
const LoginController = require('../controllers/login.controller');

// ? Usuario Routes
router.get('/usuario', validarToken, UsuarioController.getAll);
router.post('/usuario', [validarToken,verificaAdmin_Role], UsuarioController.createUsuario);
router.put('/usuario/:id', [validarToken,verificaAdmin_Role], UsuarioController.updateUsuario)
router.delete('/usuario/:id', [validarToken,verificaAdmin_Role], UsuarioController.deleteUsuario);

// * ---------------------------------------------------------------------

// ? Login Routes
router.post('/login', LoginController.login);
router.post('/google', LoginController.google)

module.exports = router;