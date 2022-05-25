"use strict";

const express = require("express");
const productController = require("../controllers/producto.controller");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.put("/agregarProducto", [mdAuth.Auth], productController.AgregarProducto);
api.put("/editarProducto/:id", [mdAuth.Auth], productController.EditarProducto);
api.put("/eliminarProducto/:id", [mdAuth.Auth], productController.EliminarProducto);
api.get("/Obtenerproductos", [mdAuth.Auth], productController.ObtenerProductos);
api.get("/ObtenerProductos/:id",[mdAuth.Auth],productController.obtenerProductosId);

module.exports = api;