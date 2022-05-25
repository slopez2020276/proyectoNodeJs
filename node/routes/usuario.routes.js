"use strict";

const express = require("express");
const userController = require("../controllers/usuario.controller");
const mdAuth = require("../middlewares/authenticated");

var api = express.Router();

api.post("/login", userController.login);
api.post("/crearEmpresa", [mdAuth.Auth, mdAuth.ensureAuthAdmin], userController.crearEmpresa);
api.put("/editarEmpresa/:id", [mdAuth.Auth, mdAuth.ensureAuthAdmin], userController.EditarEmpresa);
api.delete("/EliminarEmpresa/:id", [mdAuth.Auth, mdAuth.ensureAuthAdmin], userController.eliminarEmpresa);
api.get("/obtenerEmpresas", [mdAuth.Auth, mdAuth.ensureAuthAdmin], userController.ObtenerEmpresas);
api.get("/obtenerEmpresaId/:id",[mdAuth.Auth, mdAuth.ensureAuthAdmin],userController.obtenerEmpresaId)

module.exports = api;