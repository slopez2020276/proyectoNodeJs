const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;


const SucursalesSchema = Schema({

        nombre: String, 
        direccion: String, 
        productos: [{
            nombreProducto: String,
            precioProducto: Number,
            stock: Number
        }],
        idEmpresa: {type : Schema.Types.ObjectId, ref:'Empresa'}
    })

    module.exports = mongoose.model('Sucursales', SucursalesSchema)