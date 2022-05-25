'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productos = Schema({
    nombre: String,
    proveedor: String,
    stock: Number,
});

module.exports = mongoose.model('productos', productos);