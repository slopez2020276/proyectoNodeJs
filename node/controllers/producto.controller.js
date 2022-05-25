"use strict"

const Producto = require("../models/productos.model");
const Usuario = require("../models/usuario.model");

function AgregarProducto(req,res){
    var params = req.body;
    var userId = req.user.sub;
    var modeloProductos = new Producto();

    if(params.nombre && params.proveedor && params.stock){
        modeloProductos.nombre = params.nombre;
        modeloProductos.proveedor = params.proveedor;
        modeloProductos.stock = params.stock;
        modeloProductos.save((err,productSaved)=>{
            if(err){
                return res.status(500).send({message: "Error al crear producto"});
            }else if(productSaved){
                Usuario.findByIdAndUpdate(userId, {$push: {productos: productSaved._id}},{new: true},(err,userUpdated)=>{
                    if(err){
                        return res.status(500).send({message: "Error al añadir producto"});
                    }else if(userUpdated){
                        return res.send({message: "Producto creado y agregado exitosamente", productSaved});
                    }else{
                        return res.status(500).send({message: "No se pudo añadir el producto a la empresa"});
                    }
                })
            }else{
                return res.status(500).send({message: "No se creó el producto"});
            }
        })
    }else{
        return res.send({message: "Ingrese los datos mínimos para crear un producto"});
    }
}


function EditarProducto(req,res){
    var productId = req.params.id;
    var update = req.body;
    
    Producto.findByIdAndUpdate(productId, update,{new: true},(err,productUpdated)=>{
        if(err){
            return res.status(500).send({message: "Error al actualizar producto"});
        }else if(productUpdated){
            return res.send({message: "Producto actualizado", productUpdated});
        }else{
            return res.status(500).send({message: "Producto inexistente"});
        }
    })
}

function EliminarProducto(req,res){
    var productId = req.params.id;
    var userId = req.user.sub;

    Usuario.findById(userId,(err,userFinded)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar empresa"});
        }else if(userFinded){
            if(userFinded.productos.includes(productId)){
                Usuario.findByIdAndUpdate(userId,{$pull: {productos: productId}},{new: true},(err,userUpdated)=>{
                    if(err){
                        return res.status(500).send({message: "Error al eliminar producto de empresa"});
                    }else if(userUpdated){
                        Producto.findByIdAndRemove(productId,(err,productRemoved)=>{
                            if(err){
                                return res.status(500).send({message: "Error al eliminar producto"});
                            }else if(productRemoved){
                                return res.send({message: "Producto eliminado exitosamente"});
                            }else{
                                return res.status(500).send({message: "No se eliminó el producto"});
                            }
                        })
                    }else{
                        return res.status(500).send({message: "No se eliminó el producto de la empresa"});
                    }
                })
            }else{
                return res.status(401).send({message: "El producto no pertenece a esta empresa, no existe o ya fue eliminado"});
            }
        }else{
            return res.status(404).send({message: "Empresa inexistente"});
        }
    })
}

function ObtenerProductos(req,res){
    var Id = req.user.sub;

    Usuario.findById(Id,(err,usuarioEncontrado)=>{
        if(err) return res.status(500).send({message: "error en la peticion"})
        if(usuarioEncontrado){
            
            let productos = usuarioEncontrado.productos

            return res.status(200).send({productos})

        }else{
            return res.status(500).send({message: "error al obtener"})
        }
    }).populate('productos')
}

function obtenerProductosId(req,res){
    var id = req.params.id;
    Producto.findById(id,(err,productoFinded)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});
        if(productoFinded){
            return res.status(200).send({usuario:productoFinded});
        }
    })

}

module.exports = {
    AgregarProducto,
    EditarProducto,
    EliminarProducto,
    ObtenerProductos,
    obtenerProductosId
} 