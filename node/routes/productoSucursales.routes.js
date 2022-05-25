"use strict";

const express = require("express");
const productoSucursalesController = require("../controllers/proSucursales.controller");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.put("/agregarProductoSucursales/:id", [mdAuth.Auth], productoSucursalesController.AgregarProductoSucursal);
api.put("/editarProductoSucursales/:id", [mdAuth.Auth], productoSucursalesController.EditarProducto);
api.put("/eliminarProductoSucursal/:id/:idProducto", [mdAuth.Auth], productoSucursalesController.EliminarProducto);
api.get("/ObtenerproductosSucursal/:id", [mdAuth.Auth], productoSucursalesController.ObtenerProductos);
api.put("/Venta/:id", [mdAuth.Auth], productoSucursalesController.Venta);
api.get("/ObtenerProductosId/:id", [mdAuth.Auth], productoSucursalesController.obtenerProductosId);

module.exports = api;