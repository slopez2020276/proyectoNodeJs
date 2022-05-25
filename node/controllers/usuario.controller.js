"use strict"

const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

const Usuario = require("../models/usuario.model");

function adminDefult() {
    var usuarioModel = new Usuario();

    Usuario.findOne({ username: "SuperAdmin" }, (err, SuperAdminFinded) => {
        if (err) {
            console.log(err);
        } else if (SuperAdminFinded) {
            console.log("Usuario SuperAdmin ya fue creado");
        } else {
            bcrypt.hash("123456", null, null, (err, passwordHashed) => {
                if (err) {
                    console.log("Error al encriptar contraseña de SuperAdmin");
                } else if (passwordHashed) {
                    usuarioModel.password = passwordHashed;
                    usuarioModel.nombre = "SuperAdmin";
                    usuarioModel.username = "SuperAdmin";
                    usuarioModel.rol = "ROL_Admin";
                    usuarioModel.save((err, userSaved) => {
                        if (err) {
                            console.log("Error al crear usuario SuperAdmin");
                        } else if (userSaved) {
                            console.log("Usuario SuperAdmin creado exitosamente");
                        } else {
                            console.log("No se creó el usuario SuperAdmin");
                        }
                    });
                } else {
                    console.log("Contraseña de SuperAdmin no encriptada");
                }
            });
        }
    });
}

function login(req,res){
    var params = req.body;
    
    if(params.username && params.password){
        Usuario.findOne({username: params.username}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general en la verificación de la contraseña'});
                    }else if(checkPassword){
                        if(params.getToken == 'true'){
                            return res.send({ token: jwt.crearToken(userFind)});
                        }else{
                            userFind.password = undefined;
                            return res.status(200).send({ usuario: userFind })
                        }
                    }else{
                        return res.status(401).send({message: 'Contraseña incorrecta'});
                    }
                })
            }else{
                return res.send({message: 'Usuario inexistente'});
            }
        })
    }else{
        return res.status(401).send({message: 'Por favor ingresa los datos obligatorios'});
    }
}

function crearEmpresa(req,res){
    var usuarioModel = new Usuario();
    var params = req.body;

    Usuario.findOne({username: params.username},(err,userFinded)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar empresa"});
        }else if(userFinded){
            return res.send({message: "Empresa ya existente"});
        }else{
            if(params.nombre && params.username && params.password && params.direccion && params.numero){
                bcrypt.hash(params.password, null, null, (err, passwordHashed) => {
                    if (err) {
                        return res.status(500).send({message: "Error al encriptar contraseña"});
                    } else if (passwordHashed) {
                        usuarioModel.password = passwordHashed;
                        usuarioModel.nombre = params.name;
                        usuarioModel.username = params.username;
                        usuarioModel.direccion = params.direccion;
                        usuarioModel.numero = params.phone;
                        usuarioModel.rol ='ROL_EMPRESA'
                        usuarioModel.descripcion = params.descripcion;
                        usuarioModel.save((err, userSaved) => {
                            if (err) {
                                return res.status(500).send({message: "Error al agregar empresa"});
                            } else if (userSaved) {
                                return res.send({message: "Empresa agregada exitosamente",userSaved});
                            } else {
                                return res.status(500).send({message: "No se agregó la empresa"});
                            }
                        });
                    } else {
                        console.log("Contraseña de SuperAdmin no encriptada");
                    }
                });
            }else{
                return res.send({message: "Ingrese los datos mínimos para crear una empresa"});
            }
        }
    })
}

function EditarEmpresa(req, res){
    let userId = req.params.id;
    let update = req.body;

        Usuario.findById(userId, (err, userFind)=>{
            if(err){
                return res.status(500).send({ message: 'Error general'});
            }else if(userFind){
                Usuario.findOne({username: update.username},(err,userFinded)=>{
                    if(err){
                        return res.status(500).send({message: "Error al buscar nombre de usuario"});
                    }else if(userFinded){
                        if(userFinded.username == update.username){
                            Usuario.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al actualizar'});
                                }else if(userUpdated){
                                    return res.send({message: 'Empresa actualizada', userUpdated});
                                }else{
                                    return res.send({message: 'No se pudo actualizar la empresa'});
                                }
                            })
                        }else{
                            return res.send({message: "Nombre de usuario ya en uso"});
                        }
                    }else{
                        Usuario.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al actualizar'});
                            }else if(userUpdated){
                                return res.send({message: 'Empresa actualizada', userUpdated});
                            }else{
                                return res.send({message: 'No se pudo actualizar la empresa'});
                            }
                        })
                    }
                })
            }else{
                return res.send({message: "Empresa inexistente"});
            }
        })
    }
    

function eliminarEmpresa(req,res){
    var userId = req.params.id;

    Usuario.findById(userId,(err,userFinded)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar empresa"});
        }else if(userFinded){
            Usuario.findByIdAndRemove(userId,(err,userRemoved)=>{
                if(err){
                    return res.status(500).send({message: "Error al eliminar empresa"});
                }else if(userRemoved){
                    return res.send({message: "Empresa eliminada exitosamente",userRemoved});
                }else{
                    return res.status(500).send({message: "No se eliminó la empresa"});
                }
            })
        }else{
            return res.send({message: "Empresa inexistente o ya fue eliminada"});
        }
    })
}

function ObtenerEmpresas(req,res){
    Usuario.find({rol: "ROL_EMPRESA"}).exec((err,users)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener empresas"});
        }else if(users){
            return res.send({message: "Empresas", users});
        }else{
            return res.send({message: "No hay empresas"});
        }
    })
}

function obtenerEmpresaId(req,res){
    var id = req.params.id;
    Usuario.findById(id,(err,usuariofined)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});
        if(usuariofined){
            return res.status(200).send({usuario:usuariofined});
        }
    })

}

module.exports = {
    adminDefult,
    login,
    crearEmpresa,
    EditarEmpresa,
    eliminarEmpresa,
    ObtenerEmpresas,
    obtenerEmpresaId
}