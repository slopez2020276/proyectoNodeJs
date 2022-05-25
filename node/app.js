'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

const usuario = require("./routes/usuario.routes");
const sucursales = require("./routes/suscursales.routes");
const productRoutes = require("./routes/producto.routes");
const productoSucursales = require("./routes/productoSucursales.routes")


var app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use("/api",usuario);
app.use("/api",sucursales);
app.use("/api",productRoutes);
app.use("/api",productoSucursales)

module.exports = app;