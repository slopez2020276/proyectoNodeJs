'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Usuario = Schema({
    nombre: String,
    username: String,
    password: String,
    direccion: String,
    numero: Number,
    rol: String,
    descripcion:String,
    Sucursales: [{type: Schema.ObjectId, ref: 'Sucursales'}],
    productos: [{type: Schema.ObjectId, ref: 'productos'}]
});

module.exports = mongoose.model('Usuario', Usuario);