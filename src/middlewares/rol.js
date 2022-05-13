exports.verAdmin = function(req, res, next) {
    if(req.user.rol !== "Administrador") return res.status(403).send({mensaje: "Solo puede acceder el admin"})
    
    next();
}

exports.verEmpresa = function(req, res, next) {
    if(req.user.rol !== "Empresa") return res.status(403).send({mensaje: "Solo puede acceder la empresa"})
    
    next();
}