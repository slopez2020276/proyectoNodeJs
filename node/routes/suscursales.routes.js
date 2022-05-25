"use strict";

const express = require("express");
const SucursalesController = require("../controllers/Sucursales.controller");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.put("/agregarSucursales", [mdAuth.Auth], SucursalesController.AgregarSucursales);
api.put("/EditarSucursales/:id", [mdAuth.Auth], SucursalesController.EditarSucursales);
api.put("/Eliminarsucursales/:id", [mdAuth.Auth], SucursalesController.EliminarSucursal);
api.get("/ObternerSucursales", [mdAuth.Auth], SucursalesController.ObtenerSucursales);
api.get("/ObtenerSucursalesId/:id", [mdAuth.Auth], SucursalesController.ObtenerSucursalesId);

module.exports = api; 