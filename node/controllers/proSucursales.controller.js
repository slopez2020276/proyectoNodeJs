const Producto = require("../models/productos.model");
const Sucursales = require("../models/Sucursales.model");
const Usuario = require("../models/usuario.model")
const ProductoSucursales = require("../models/proSucursales.model")

function AgregarProductoSucursal(req,res){
    var params = req.body;
    var SucursalId = req.params.id;
    var iduser = req.user.sub;
    var modeloProductosSucursales = new ProductoSucursales();

    Usuario.findById(iduser,((err,Sucursalfinded)=>{
        if(err) return res.status(500).send({message: "error en la peticion"});
        if(Sucursalfinded){
            let productosA = Sucursalfinded.productos;
            Producto.findOne({nombre : params.nombre },(err,productFinded)=>{
                if(err) return res.status(500).send({message: "error en la peticion"});
                if(productFinded){

                    let ProductoEN = productFinded._id

                if (productosA.includes(ProductoEN)){
                    Sucursales.findById(SucursalId,(err,SucursalFinded)=>{
                        if(err)return res.status(500).send({message: "error en la peticion"});
                        if(SucursalFinded){
                            let SucursalesA = Sucursalfinded.Sucursales;
                            if(SucursalesA.includes(SucursalId)){
                                Sucursales.findById(SucursalId,(err,SucursalFinded1)=>{
                                    if(err) return res.status(500).send({message: "error en la peticion"});
                                    if(SucursalFinded1){
                                        ProductoSucursales.findOne({nombre: params.nombre},(err,productFinded1)=>{
                                            if(err) return res.status(500).send({message: "error en la peticion"});
                                            if(productFinded1){
                                                ProductoSucursales.findByIdAndUpdate(productFinded1._id,{$pull:{}})
                                                    
                                                 var stock = productFinded.stock - parseInt(params.stock);
                                                 var stockPro = productFinded1.stock + parseInt(params.stock);
                                            
                                                Producto.findByIdAndUpdate(ProductoEN,{stock: stock,},{new:true},(err,productUpdated)=>{
                                                 if(err){
                                                 return res.status(500).send({message: "Error al actualizar producto"});
                                                }else if(productUpdated){
                                                    ProductoSucursales.findByIdAndUpdate(productFinded1._id,{stock: stockPro,},{new:true},(err,productUpdated1)=>{
                                                        if(err)return res.status(500).send({message: "error en la peticion"});
                                                        if(productUpdated1){
                                                            return res.status(500).send({proSucursales:productUpdated1})
                                                        }
                                                    })
                                                
                                                  }else{
                                                      return res.status(500).send({message: "No se adquirió el producto"});
                                                              }
                                                                 })
               


                                            }else{

                                                if(params.nombre && params.precioUnitario && params.stock){
                                                    modeloProductosSucursales.nombre = params.nombre;
                                                    modeloProductosSucursales.precioUnitario = params.precioUnitario;
                                                    modeloProductosSucursales.stock = params.stock;
                                                    modeloProductosSucursales.save((err,productSaved)=>{
                                                        if(err){
                                                            return res.status(500).send({message: "Error al crear producto"});
                                                        }else if(productSaved){
                                                           
                                                                
                                                            
                                                            Sucursales.findByIdAndUpdate(SucursalId, {$push: {productos: productSaved._id}},{new: true},(err,userUpdated)=>{
                                                                if(err){
                                                                    return res.status(500).send({message: "Error al añadir producto"});
                                                                }else if(userUpdated){
                                                                
                                                                    var stock = productFinded.stock - parseInt(params.stock);
                                            
                                                Producto.findByIdAndUpdate(ProductoEN,{stock: stock,},{new:true},(err,productUpdated)=>{
                                                 if(err){
                                                 return res.status(500).send({message: "Error al actualizar producto"});
                                                }else if(productUpdated){
                                                 return res.send({message: "Producto adquirido exitosamente", productUpdated});
                                                  }else{
                                                      return res.status(500).send({message: "No se adquirió el producto"});
                                                              }
                                                                 })
                                                                    
                                                                }else{
                                                                    return res.status(500).send({message: "No se pudo añadir el producto a la empresa"});
                                                                }
                                                            })
                                                        
                                                       }else{
                                                            return res.status(500).send({message: "No se creó el producto"});
                                                        }
                                                    })
                                                }else{
                                                    return res.send({message: "Ingrese los datos mínimos para crear un producto"});
                                                }

                                            }
                                        })
                                        
                                    }
                                })
                            }
                           
                        }else{
                            return res.status(500).send({message: "erro al encontrar la sucursal"})
                        }

                    })

                }else{
                    return res.status(500).send({message: "no cuenta con este productos en su empresa"})
                }
                
                    
                }else{
                    return res.status(500).send({message: "El producto no existe"})

                }
                    
            })




        }else {
            return res.status(500).send({message: "error al encontrar el usuario"})
        }

    }))

  
}

function EditarProducto(req,res){
    var productId = req.params.id;
    var update = req.body;
    
    ProductoSucursales.findByIdAndUpdate(productId, update,{new: true},(err,productUpdated)=>{
        if(err){
            return res.status(500).send({message: "Error al actualizar producto"});
        }else if(productUpdated){
            return res.send({message: "Producto actualizado", productUpdated});
        }else{
            return res.status(500).send({message: "Producto inexistente"});
        }
    })
}

function EliminarProducto(req,res){
    var SucursalId = req.params.id;
    var productId = req.params.idProducto;

    Sucursales.findById(SucursalId,(err,Sucursalfinded)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar empresa",SucursalFinded});
        }else if(Sucursalfinded){
            if(Sucursalfinded.productos.includes(productId)){
                Sucursales.findByIdAndUpdate(SucursalId,{$pull: {productos: productId}},{new: true},(err,userUpdated)=>{
                    if(err){
                        return res.status(500).send({message: "Error al eliminar producto de empresa"});
                    }else if(userUpdated){
                        ProductoSucursales.findByIdAndRemove(productId,(err,productRemoved)=>{
                            if(err){
                                return res.status(500).send({message: "Error al eliminar producto"});
                            }else if(productRemoved){
                                return res.send({message: "Producto eliminado exitosamente"});
                            }else{
                                return res.status(500).send({message: "No se eliminó el producto"});
                            }
                        })
                    }else{
                        return res.status(500).send({message: "No se eliminó el producto de la empresa"});
                    }
                })
            }else{
                let a=Sucursalfinded.productos;
                return res.status(401).send({message: "El producto no pertenece a esta empresa, no existe o ya fue eliminado",a,productId});
            }
        }else{
            return res.status(404).send({message: "Empresa inexistente"});
        }
    })
}

function ObtenerProductos(req,res){
    var Id = req.params.id;

    Sucursales.findById(Id,(err,SucursalFinded)=>{
        if(err) return res.status(500).send({message: "error en la peticion"})
        if(SucursalFinded){
            
            let productos = SucursalFinded.productos

            return res.status(200).send({productos})
        }else{
            return res.status(500).send({message: "error al obtener"})
        }}).populate('productos')
}

function Venta(req,res){
    let productId = req.params.id;
    var params = req.body;

    if(params.stock){
        ProductoSucursales.findById(productId,(err,productFinded)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar producto"});
            }else if(productFinded){
                if(productFinded.stock < params.stock){
                    return res.send({message: "Cantidad de producto insuficiente para su pedido"});
                }else{
                    var stock = productFinded.stock - parseInt(params.stock);
                    var cantidad = productFinded.ventas + parseInt(params.stock);
                    ProductoSucursales.findByIdAndUpdate(productId,{stock: stock, ventas: cantidad},{new:true},(err,productUpdated)=>{
                        if(err){
                            return res.status(500).send({message: "Error al actualizar producto"});
                        }else if(productUpdated){
                            return res.send({message: "Producto adquirido exitosamente", productUpdated});
                        }else{
                            return res.status(500).send({message: "No se adquirió el producto"});
                        }
                    })
                }
            }else{
                return res.send({message: "Producto inexistente"});
            }
        })
    }else{
        return res.send({message: "Ingrese la cantidad a comprar"});
    }
}

function obtenerProductosId(req,res){
    var id = req.params.id;
    ProductoSucursales.findById(id,(err,productoSFinded)=>{
        if(err) return res.status(500).send({message:'error en la peticion'});
        if(productoSFinded){
            return res.status(200).send({usuario:productoSFinded});
        }
    })

}

module.exports = {
    AgregarProductoSucursal,
    EditarProducto,
    EliminarProducto,
    ObtenerProductos,
    Venta,
    obtenerProductosId
} 