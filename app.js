const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRutas = require('./src/routes/usuario.routes');
const EmpresaRutas = require('./src/routes/empresa.routes');
const SucursalesRutas = require('./src/routes/sucursales.routes')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', UsuarioRutas, EmpresaRutas, SucursalesRutas);


module.exports = app;