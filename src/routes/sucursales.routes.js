const express = require('express');
const sucursalesControlador = require('../controllers/sucursalesController');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles= require('../middlewares/rol');

const api = express.Router();


api.post('/agregarSucursal',[md_autenticacion.Auth,md_roles.verEmpresa], sucursalesControlador.agregarSucursal);

api.put('/editarSucursal/:idSucursal',[md_autenticacion.Auth,md_roles.verEmpresa], sucursalesControlador.editarSucursal);

api.get('/obtenerSucursales',[md_autenticacion.Auth,md_roles.verEmpresa],sucursalesControlador.obtenerSucursales);

api.delete('/eliminarSucursales/:idSucursal',[md_autenticacion.Auth,md_roles.verEmpresa], sucursalesControlador.eliminarSucursal); 
api.get('/obtenerProductos/:idSucursal', [md_autenticacion.Auth,md_roles.verEmpresa], sucursalesControlador.obtenerProductos);
api.put('/generarVenta/:idProducto/:idSucursal',[md_autenticacion.Auth,md_roles.verEmpresa], sucursalesControlador.generarVenta)
api.get('/obtenerProdid/:idProducto/:idSucursal', md_autenticacion.Auth, sucursalesControlador.obtenerProductoId)

module.exports = api;