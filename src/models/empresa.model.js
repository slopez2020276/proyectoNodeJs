const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const EmpresaSchema = Schema({

    nombre: String,
    direccion: String, 
    descripcion: String,
    rol: String, 
    password: String,
 
       productos: [{
            nombreProducto: String,
            precioProducto: Number,
            stock: Number
        }]


})
module.exports = mongoose.model('Empresa', EmpresaSchema)