const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')
const res = require('express/lib/response');
const Sucursales = require('../models/sucursales.model')



function agregarSucursal(req, res) {
    const parametros = req.body;
    const modeloSucursal = new Sucursales();
        modeloSucursal.nombre = parametros.nombre;
        modeloSucursal.direccion = parametros.direccion;
        modeloSucursal.idEmpresa = req.user.sub;
        modeloSucursal.save((err, sucursalGuardada) => {

            if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
            if (!sucursalGuardada) return res.status(500).send({ mensaje: 'error al agregar la sucursal' })
            return res.status(200).send({ sucursal: sucursalGuardada })

        })
}



function editarSucursal(req, res) {
    const parametros = req.body;
    
    const idEmpresaa = req.user.sub;
    const idSucursal = req.params.idSucursal;

   

        Sucursales.findOne({ idEmpresa: idEmpresaa }, (err, sucursalEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'error en la peticion 1' })

            if (sucursalEncontrada) {
                Sucursales.findByIdAndUpdate(idSucursal, parametros, { new: true }, (err, sucursalEditada) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion 2' })
                    if (!sucursalEditada) return res.status(500).send({ mensaje: 'error al editar la sucursal' })
                    return res.status(200).send({ sucursal: sucursalEditada })
                })
            } else {
                return res.status(500).send({ mensaje: 'error al encontrar la sucursal' })
            }



        })


}
function eliminarSucursal(req, res) {
    const idSucursal = req.params.idSucursal;
    const idEmpresaa = req.user.sub;




    Sucursales.findOne({ idEmpresa: idEmpresaa }, (err, sucursalEncontrada) => {
        if (sucursalEncontrada) {
            if(sucursalEncontrada.idEmpresa==idEmpresaa){
                Sucursales.findByIdAndDelete({ _id: idSucursal }, (err, sucursalEliminada) => {
                    if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })
                    if (!sucursalEliminada) return res.status(500).send({ mensaje: 'error al editar sucursal' })
                    return res.status(200).send({ sucursal: sucursalEliminada })
                })
            }else{
                return res.status(500).send({ mensaje: 'No puede eliminar sucurasles de otras empresas' })
            }
        } else {
            return res.status(500).send({ mensaje: 'error al encontrar las sucursal'})
        }
    })



}
function obtenerSucursales(req, res) {
    const idEmpresaa = req.user.sub;
    Sucursales.find({ idEmpresa: idEmpresaa }, (err, sucursalesEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'error en la peticion 1' })
        if (!sucursalesEncontradas) return res.status(500).send({ mensaje: 'error al encontrar las sucursales' })
        return res.status(200).send({ sucursales: sucursalesEncontradas })
    })
}


function obtenerProductos(req, res) {
    const idSucursal = req.params.idSucursal;
    Sucursales.aggregate([
        {
            $match: { "_id": mongoose.Types.ObjectId(idSucursal) }
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
        if(productosEncontrados[0] == null){
            return res.status(500).send({ mensaje: 'No se encontro'})

        }else{
            return res.status(200).send({ productos: productosEncontrados[0].productos})

        }
    })
}
function ObtenerSucursalxId(req, res) {
    const idSucursal = req.params.idSucursal;

    Sucursales.findById(idSucursal, (err, sucursalEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!sucursalEncontrada) return res.status(500).send({ mensaje: 'Error al obtener el Producto' });

        return res.status(200).send({ sucursal: sucursalEncontrada })
    })
}
function generarVenta(req, res) {
    const idProducto = req.params.idProducto
    const idEmpresa = req.user.sub;
    const parametros = req.body;


    const idSucursal = req.params.idSucursal;
    Sucursales.aggregate([
        {
            $match: { "_id": mongoose.Types.ObjectId(idSucursal) }
        },
        {
            $unwind: "$productos"
        },
        {
            $match: { "productos._id": mongoose.Types.ObjectId(idProducto) }
        },
        {
            $group: {
                "_id": "$_id",
                "nombre": { "$first": "$nombre" },
                "productos": { $push: "$productos" }
            }
        }
    ]).exec((err, productosEncontrados) => {

        if (productosEncontrados[0].productos[0].stock < parametros.stock) {
            return res.status(500).send({mensaje: 'No hay suficiente stock'})
        } else {
            Sucursales.updateOne({ "productos._id": idProducto }, { $inc: { "productos.$.stock": -parametros.stock } }, { new: true }, (err, productosActualizados) => {

                if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
                if (!productosActualizados) return res.status(500).send({ mensaje: 'error al editar el producto' })

                return res.status(200).send({ producto: productosActualizados })

            })
        }



    })




}
function obtenerProductoId(req, res){
    const idProducto = req.params.idProducto
    const idSucursal = req.params.idSucursal;
    Sucursales.aggregate([
        {
            $match: { "_id": mongoose.Types.ObjectId(idSucursal) }
        },
        {
            $unwind: "$productos"
        },
        {
            $match: { "productos._id": mongoose.Types.ObjectId(idProducto) }
        },
        {
            $group: {
                "_id": "$_id",
                "nombre": { "$first": "$nombre" },
                "productos": { $push: "$productos" }
            }
        }
    ]).exec((err, productosEncontrados) => {

        return res.status(200).send({productos: productosEncontrados[0].productos[0]})

    })
}
module.exports = {
    obtenerProductoId,
    obtenerSucursales,
    eliminarSucursal,
    editarSucursal,
    agregarSucursal,
    obtenerProductos,
    ObtenerSucursalxId,
    generarVenta
}










