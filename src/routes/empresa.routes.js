const express = require('express');
const empresaControlador = require('../controllers/empresaController');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles= require('../middlewares/rol');
const api = express.Router();

api.post('/agregarEmpresa',[md_autenticacion.Auth,md_roles.verAdmin] ,empresaControlador.agregarEmpresa);


api.put('/editarEmpresa/:idEmpresa', [md_autenticacion.Auth,md_roles.verAdmin], empresaControlador.editarEmpresa);

api.delete('/eliminarEmpresa/:idEmpresa',[md_autenticacion.Auth,md_roles.verAdmin], empresaControlador.eliminarEmpresa); 

api.get('/obtenerEmpresas', md_autenticacion.Auth,empresaControlador.obtenerEmpresas);

api.put('/agregarProductosEmpresa',[md_autenticacion.Auth,md_roles.verEmpresa], empresaControlador.agregarProductos);

api.put('/editarProductosEmpresa/:idProducto', [md_autenticacion.Auth,md_roles.verEmpresa], empresaControlador.editarProductos);

api.get('/obtenerProductosEmpresa', [md_autenticacion.Auth,md_roles.verEmpresa], empresaControlador.obtenerProductos);

api.delete('/eliminarProductosEmpresa/:idProducto', [md_autenticacion.Auth,md_roles.verEmpresa], empresaControlador.eliminarProductos);

api.get('/obtenerProductoEmpresa/:idProducto',[md_autenticacion.Auth,md_roles.verEmpresa], empresaControlador.obtenerProducto);

api.put('/agregarProductosSucursal/:idSucursal/:idProducto', [md_autenticacion.Auth,md_roles.verEmpresa], empresaControlador.agregarProductosSucursal);



module.exports = api;