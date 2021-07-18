const express = require('express');

const router = express.Router();

const UsuarioController = require('../controllers/usuario.controller');
const LoginController = require('../controllers/login.controller');

// ? Usuario Routes
router.get('/usuario', UsuarioController.getAll);
router.post('/usuario', UsuarioController.createUsuario);
router.put('/usuario/:id', UsuarioController.updateUsuario)
router.delete('/usuario/:id', UsuarioController.deleteUsuario);

// * ---------------------------------------------------------------------

// ? Login Routes
router.post('/login', LoginController.login);

module.exports = router;