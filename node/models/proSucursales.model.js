'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSucursales = Schema({
    nombre:String,
    precioUnitario: String,
    stock: Number,
    ventas: {type: Number, default: 0}
});

module.exports = mongoose.model('productoSucursales', productoSucursales);