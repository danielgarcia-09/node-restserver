const jwt = require('jsonwebtoken');

// * Verificar Token

let validarToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if ( err ) {
            return res.status(401).json({
                ok: false,
                err
            })
        } 

        req.usuario = decoded.usuario;
        next();

    })
     

}

let verificaAdmin_Role = (req, res, next) => {

    const { role } = req.usuario;

    if(role === "ADMIN_ROLE"){
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Only for users with ADMIN'
            }
        })
    }
}

module.exports = {
    validarToken,
    verificaAdmin_Role
}