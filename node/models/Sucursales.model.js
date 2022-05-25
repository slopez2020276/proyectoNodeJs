'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Sucursales = Schema({
    nombreSucursal: String,
    direccionSucursal: String,
    numero: Number,
    productos: [{type: Schema.ObjectId, ref: 'productoSucursales'}]
});

module.exports = mongoose.model('Sucursales', Sucursales);