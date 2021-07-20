const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

let LoginController = {};

LoginController.login = (req ,res) => {
   
    let { email, password } = req.body;

    Usuario.findOne({ email: email }, (err, usuarioDB) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if( !bcrypt.compareSync( password , usuarioDB.password )) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD})

        res.status(202).json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    })
}

// * GOOGLE CONFIG

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}


LoginController.google = async (req, res) => {

    let { idtoken } = req.body;

    let googleUser = await verify( idtoken )
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });
   
    Usuario.findOne( { email: googleUser.email}, (err, usuarioDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // ? Si el usuario existe en la BD
        if( usuarioDB ) {

            //! Si el usuario no fue creado por google
            if( usuarioDB.google === false ) {
                
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion normal'
                    }
                });

            } else {

                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });

                return res.status(202).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }

        //! Si el usuario no existe en la BD

        } else {

            let usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: ':)',
            })

            usuario.save( (err, usuarioDB) => {
                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB,
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD });

                return res.status(202).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })
        }
    }); 

}

module.exports = LoginController;