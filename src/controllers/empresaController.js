const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')
const res = require('express/lib/response');
const Empresa = require('../models/empresa.model')
const Usuario = require('../models/usuario.model')
const Sucursales = require('../models/sucursales.model')


function agregarEmpresa(req, res){
    const parametros = req.body; 
    const modeloEmpresa = new Empresa();
        bcrypt.hash(parametros.password, null, null, (err, passwordEncryptada) => {


            modeloEmpresa.nombre = parametros.nombre;
            modeloEmpresa.direccion = parametros.direccion; 
            modeloEmpresa.descripcion = parametros.descripcion; 
            modeloEmpresa.rol = 'Empresa';    
        
                modeloEmpresa.password = passwordEncryptada
                modeloEmpresa.save((err, empresaGuardada)=>{
                    if(err) return res.status(500).send({mensaje: 'error en la peticion 1'})
                    if(!empresaGuardada) return res.status(500).send({mensaje: 'error al agregar empresa'})
            
                    return res.status(200).send({empresa: empresaGuardada})
                })
            })
}
function editarEmpresa(req, res){
    const parametros = req.body; 
    const idEmpresa = req.params.idEmpresa;

    if(req.params.idEmpresa==null){

        return res.status(500).send({mensaje: 'por favor envie el id de la empresa que quiere eliminar'})
    }else{
        Empresa.findByIdAndUpdate(idEmpresa, parametros, {new: true}, (err, empresaActualizada)=>{
            if(err) return res.status(500).send({mensaje: 'Hubo en la peticion'});
            if(!empresaActualizada) res.status(500).send({mensaje: 'Hubo un error al actualizar la empresa'})

            return res.status(200).send({empresa: empresaActualizada})
        })


    }
    

        
   
}

function eliminarEmpresa(req, res){
    const idEmpresa = req.params.idEmpresa; 

    if(idEmpresa==null){
        return res.status(500).send({mensaje: 'por favor envie el id de la empresa que quiere eliminar'})

    }else{
        Empresa.findByIdAndDelete({_id: idEmpresa}, (err, empresaEliminada)=>{
            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'});
            if(!empresaEliminada) return res.status(500).send({mensaje: 'Hubo un error al eliminar la empresa'}); 
    
            return res.status(200).send({empresa: empresaEliminada})
        })

    }

       
    

}
function obtenerEmpresas(req, res){
    

    if(req.user.rol == 'Administrador'){

            Empresa.find({}, (err, empresaEncontradas)=>{
                if(err) return res.status(500).send({mensaje: 'error en la peticion 1'})
                if(!empresaEncontradas) return res.status(500).send({mensaje: 'error al mostrar las empresas'})
    
                return res.status(200).send({empresa: empresaEncontradas})
            })
    


        }else if (req.user.rol =='Empresa' ){
            Empresa.find({_id: req.user.sub}, (err, empresaEncontradas)=>{
                if(err) return res.status(500).send({mensaje: 'error en la peticion 2'})
                if(!empresaEncontradas) return res.status(500).send({mensaje: 'error al mostrar las empresas'})
    
                return res.status(200).send({empresa: empresaEncontradas})
            })
            }

      
  
}
function agregarProductos(req, res){
    const parametros = req.body;
    const idEmpresa = req.user.sub;

    
        Empresa.findByIdAndUpdate(idEmpresa, {$push: {productos: {nombreProducto: parametros.nombreProducto, precioProducto: parametros.precioProducto, stock: parametros.stock}}},{new:true},(err, productoAgregado)=>{
            if(err) return res.status(500).send({mensaje: 'error en la peticion 1'})
            if(!productoAgregado) return res.status(500).send({mensaje: 'error al agregar  producto'})

            return res.status(200).send({productos: productoAgregado})
        })


  

}
function editarProductos(req, res){
const parametros = req.body; 
const idProducto = req.params.idProducto;

    if(idProducto== null){
        return res.status(500).send({mensaje: 'por favor envie el id del producto que queire editar'})

    }else{
        Empresa.updateOne({"productos._id": idProducto}, {$set : {"productos.$.nombreProducto": parametros.nombreProducto, "productos.$.precioProducto": parametros.precioProducto, "productos.$.stock": parametros.stock}}, {new: true}, (err, productosActualizados)=>{

            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
            if(!productosActualizados) return res.status(500).send({mensaje: 'Hubo un error al editar el producto'})
    
            return res.status(200).send({producto: productosActualizados})
    
        })

    }

   



}
function obtenerProductos(req, res){
    const idEmpresa = req.user.sub;

   
        Empresa.aggregate([
            {
                $match: {"_id": mongoose.Types.ObjectId(idEmpresa)  }
            },
            {
                $unwind: "$productos"
            },
            {
                $match: {}
            }, 
            {
                $group: {
                    "_id": "$_id",
                    "nombre": { "$first": "$nombre" },
                    "productos": { $push: "$productos" }
                }
            }
        ]).exec((err, productosEncontrados) => {
            if(err) return res.status(400).send({mensaje: 'error en la peticion'})
            if(!productosEncontrados) return res.status(500).send({mensaje: 'error al obtener los productos'})

            return res.status(200).send({ productos: productosEncontrados[0].productos})

        })

    


        

}

function eliminarProductos(req, res){

    const idProducto = req.params.idProducto;
        if(idProducto== null){

            return res.status(500).send({mensaje: 'por favor envie el id del producto que quiere eliminar'})
        }else{
            Empresa.updateMany({_id: req.user.sub}, {$pull :{productos:{_id: idProducto}}}, (err, productoEliminado) =>{
                if(err) return res.status(500).send({mensaje: 'error en la peticion'})
                if(!productoEliminado) return res.status(500).send({mensaje: 'error al eliminar el producto'})
        
                return res.status(200).send({carrito: productoEliminado})
            })

        }

    
}
function obtenerProducto(req, res){
    const idProducto = req.params.idProducto;
    const idEmpresa = req.user.sub

    if(idProducto== null){
        return res.status(500).send({mensaje: 'por favor envie el id del producto'})
    }
      
        Empresa.aggregate([
            {
                $match: {"_id": mongoose.Types.ObjectId(idEmpresa)  }
            },
            {
                $unwind: "$productos"
            },
            {
                $match: {"productos._id": mongoose.Types.ObjectId(idProducto)}
            }, 
            {
                $group: {
                    "_id": "$_id",
                    "nombre": { "$first": "$nombre" },
                    "productos": { $push: "$productos" }
                }
            }
        ]).exec((err, productosEncontrados) => {
            if(err) return res.status(400).send({mensaje: 'error en la peticion'})
            if(!productosEncontrados) return res.status(500).send({mensaje: 'error al obtener los productos'})

            return res.status(200).send({ productos: productosEncontrados[0].productos[0]})

        })

   

}

function agregarProductosSucursal(req, res){
    const parametros = req.body;
    const idSucursal = req.params.idSucursal; 
    const idProducto = req.params.idProducto;
  
    
        Sucursales.findByIdAndUpdate(idSucursal, {$push: {productos:{nombreProducto: parametros.nombreProducto, precioProducto: parametros.precioProducto, stock: parametros.stock} }}, {new: true}, (err, productoAgregado)=>{
        
            Empresa.updateOne({"productos._id": idProducto},{$inc: {"productos.$.stock": -parametros.stock}},{new: true}, (err, empresaActualizada)=>{
                if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
                if(!empresaActualizada) return res.status(500).send({mensaje: 'Hubo un error al editar el stock de la empresa'})
            })
            
            
            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
            if(!productoAgregado) return res.status(500).send({mensaje: 'Hubo un error al editar la sucursal'})
            return res.status(200).send({producto: productoAgregado})
        })
    
    
   
    
    }


module.exports = {
    agregarProductosSucursal,
    agregarEmpresa,
    editarEmpresa,
    eliminarEmpresa,
    obtenerEmpresas,
    agregarProductos,
    editarProductos, 
    obtenerProductos,
    eliminarProductos,
    obtenerProducto
     
}