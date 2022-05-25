"use strict"

const Sucursales = require("../models/Sucursales.model");
const Usuario = require("../models/usuario.model");

function AgregarSucursales(req,res){
    var params = req.body;
    var UsuarioId = req.user.sub;
    var sucursalesModel = new Sucursales();

    if( params.nombreSucursal  && params.numero  && params.direccionSucursal){
        
        sucursalesModel.nombreSucursal = params.nombreSucursal;
        sucursalesModel.direccionSucursal = params.direccionSucursal;
        sucursalesModel.numero = params.numero;
        sucursalesModel.save((err,SucursalCreada)=>{
            if(err){
                return res.status(500).send({message: "Error al crear La sucursal"});
            }else if(SucursalCreada){
                Usuario.findByIdAndUpdate(UsuarioId, {$push: {Sucursales: SucursalCreada._id}},{new: true},(err,UsuarioActualizado)=>{
                    if(err){
                        return res.status(500).send({message: "Error al añadir empleado"});
                    }else if(UsuarioActualizado){
                        return res.send({message: " creado y agregado exitosamente", SucursalCreada});
                    }else{
                        return res.status(500).send({message: "No se pudo añadir  a la empresa"});
                    }
                })
            }else{
                return res.status(500).send({message: "No se creó la empresa"});
            }
        })
    }else{
        return res.send({message: "Ingrese los datos mínimos para crear una empresa"});
    }
}

function EditarSucursales(req,res){
    var SucursalId = req.params.id;
    var update = req.body;
    
    Sucursales.findByIdAndUpdate(SucursalId, update,{new: true},(err,employeeUpdated)=>{
        if(err){
            return res.status(500).send({message: "Error al actualizar la sucursal"});
        }else if(employeeUpdated){
            return res.send({message: "Sucursal actualizada", employeeUpdated});
        }else{
            return res.status(500).send({message: "Sucursal inexistente"});
        }
    })
}

function EliminarSucursal(req,res){
    var SucursalId = req.params.id;
    var UsuarioId =  req.user.sub;

    Usuario.findById(UsuarioId,(err,UsuarioFinded)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar empresa"});
        }else if(UsuarioFinded){
            if(UsuarioFinded.Sucursales.includes(SucursalId)){
                Usuario.findByIdAndUpdate(UsuarioId,{$pull: {Sucursales: SucursalId}},{new: true},(err,UsuarioActualizado)=>{
                    if(err){
                        return res.status(500).send({message: "Error al eliminar empleado de empresa"});
                    }else if(UsuarioActualizado){
                        Sucursales.findByIdAndRemove(SucursalId,(err,employeeRemoved)=>{
                            if(err){
                                return res.status(500).send({message: "Error al eliminar empleado"});
                            }else if(employeeRemoved){
                                return res.send({message: "Empleado eliminado exitosamente"});
                            }else{
                                return res.status(500).send({message: "No se eliminó el empleado"});
                            }
                        })
                    }else{
                        return res.status(500).send({message: "No se eliminó el empleado de la empresa"});
                    }
                })
            }else{
                return res.status(401).send({message: "El empleado no pertenece a esta empresa o no existe"});
            }
        }else{
            return res.status(404).send({message: "Empresa inexistente"});
        }
    })
}

function ObtenerSucursales(req,res){
    var UsuarioId = req.user.sub;

    Usuario.findById(UsuarioId, ((err,UsuarioFinded)=>{
        if(err){
            return res.status(500).send({message: "Error al obtener empleados"});
        }else if(UsuarioFinded){
            let sucursales = UsuarioFinded.Sucursales;
            return res.send({message: "Sucursales ", sucursales});
        }else{
            return res.status(500).send({message: "No hay empleados"});
        }
    })).populate('Sucursales')
}

function ObtenerSucursalesId(req,res){
    var id = req.params.id;
    Sucursales.findById(id,(err,sucursalesFinded)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});
        if(sucursalesFinded){
            return res.status(200).send({usuario:sucursalesFinded});
        }
    })

}

module.exports = {
    AgregarSucursales,
    EditarSucursales,
    EliminarSucursal,
    ObtenerSucursales,
    ObtenerSucursalesId
}