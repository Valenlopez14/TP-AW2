import path from 'node:path'
import fsp from 'node:fs/promises'
import { utimes } from 'node:fs';


const publica = 'publica'

let productov1;
const ruta = path.join('api' ,'v1', 'productos.json')
const convertirJson = async()=>{
    try{
        
        const LeerProductos = await fsp.readFile(ruta, 'utf-8')
        productov1 = JSON.parse(LeerProductos)
        
    }
    catch(error){
        respuesta.statusCode = 404
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("Error" + error)
    }
}

convertirJson();


const GestionarJSON = async(respuesta)=>{
    try{
        
        respuesta.statusCode = 200
        respuesta.setHeader('Content-Type', 'application/json')
        respuesta.setHeader('Access-Control-Allow-Origin','*')
        respuesta.end(JSON.stringify(productov1))
    }
    catch(error){
        respuesta.statusCode = 404
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("Error" + error)
    }
}

const GestionarIdJson = (peticion, respuesta)=>{
    const id = path.parse(peticion.url).base
    
    const producto = productov1.productos.find((producto)=>{
        return  Number(producto.id) === Number(id)
    })
    if(producto){
        const respuestaproducto = JSON.stringify(producto)
        respuesta.statusCode = 200;
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.setHeader('Access-Control-Allow-Origin','*')
        respuesta.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        respuesta.end(respuestaproducto)
    }
    else{
        respuesta.end("No se encontro un recurso con ese ID")
    }
  
}

const agregarProducto = (peticion,respuesta)=>{
    let datosProducto = '' 
    peticion.on('data',(data)=>{
        datosProducto+= data
    })
    peticion.on('error',(error)=>{
        console.error("ERROR:",error)
        respuesta.statusCode = 500
        respuesta.setHeader('Content-Type','text/plain')
        respuesta.end("Error al agregar el producto")
    })
    peticion.on('end', async()=>{
        try{
            const ultimoProd = productov1.productos[productov1.productos.length - 1]
            const ultimoId = ultimoProd.id + 1
            const datosNuevo = JSON.parse(datosProducto)
            const nuevoprod =
            {
                id: ultimoId,
                nombre: datosNuevo.nombre,
                marca: datosNuevo.marca,
                categoria: datosNuevo.categoria,
                stock: datosNuevo.stock
                
            }
            productov1.productos.push(nuevoprod)
            await fsp.writeFile(ruta, JSON.stringify(productov1))
            respuesta.statusCode = 201
            respuesta.setHeader('Content-Type', 'text/plain')
            respuesta.setHeader('Access-Control-Allow-Origin', '*')
            respuesta.end("Producto creado con Exito")
        }
        catch(error){
            console.error('ERROR:',error)
            respuesta.statusCode = 500
            respuesta.setHeader('Content-Type', 'text/plain')
            respuesta.end("Error al agregar el producto")
        }
    })
}

const EliminarProducto = async(peticion, respuesta)=>{
    const id = path.parse(peticion.url).base
    const existe = productov1.productos.find((producto)=>{
        
        return Number(producto.id) === Number(id)
        
    })
       
    if(existe){
        productov1.productos = productov1.productos.filter((producto)=>{
            return Number(producto.id) !== Number(id)
        })
        try{
            await fsp.writeFile(ruta, JSON.stringify(productov1))
            await convertirJson()
            respuesta.statusCode = 201
            respuesta.setHeader('Content-Type', 'text/plain')
            respuesta.setHeader('Access-Control-Allow-Origin', '*')
            respuesta.end("Producto eliminado con Exito")
        }
        catch(error){
            console.error('ERROR:', error)
            respuesta.statusCode = 500
            respuesta.setHeader('Content-Type', 'text/plain')
            respuesta.end('Error al eliminar producto')
        }
    
    }
    else{
        respuesta.statusCode = 404
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("Producto no encontrado")
    }
    
}

const ActualizarProducto = (peticion, respuesta)=>{
    const id = path.parse(peticion.url).base
    const ActualizarProducto = productov1.productos.find((producto)=>{
        return Number(id) === Number(producto.id)
    })

    if(ActualizarProducto){
        let datosProducto = ''
        peticion.on('data', (data)=>{
            datosProducto+= data
        })
        peticion.on('error',(error)=>{
            console.log(error)
            respuesta.statusCode=500
            respuesta.setHeader('Contet-Type', 'text/plain')
            
            respuesta.end('Error al agregar el producto')
        })

        peticion.on('end', async()=>{
            try{
                const nuevoProducto = JSON.parse(datosProducto)
                const ProductosActualizados = productov1.productos.map((producto)=>{
                    if(Number(producto.id) ===  Number(id)){
                        return{
                            id: Number(id),
                            nombre: nuevoProducto.nombre,
                            marca: nuevoProducto.marca,
                            categoria: nuevoProducto.categoria,
                            stock: nuevoProducto.stock
                        }
        
                    }
                    else{
                        return producto
                    }
                })
                productov1.productos = ProductosActualizados
                await fsp.writeFile(ruta,JSON.stringify(productov1))
                respuesta.statusCode = 201
                respuesta.setHeader('Content-Type', 'text/plain')
                respuesta.setHeader('Access-Control-Allow-Origin', '*')
                respuesta.end("Producto actualizado con Exito")
            }
            catch(error){
                console.error('ERROR:', error)
                respuesta.statusCode= 500
                respuesta.setHeader('Content-Type', 'text/plain')
                respuesta.end("Error al Actualizar el producto")
            }
        })
    }

}

const GestionarOption = (respuesta)=>{
    try{
        respuesta.statusCode = 204
        respuesta.setHeader('Access-Control-Allow-Origin', '*')
        respuesta.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        respuesta.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        respuesta.end()
    }
    catch(error){
        console.error('ERROR:', error)
        respuesta.statusCode = 404
        respuesta.end("Errorrrrrrr")
        respuesta.setHeader('Content-Type', 'text/plain')
    }

}




export {GestionarJSON, GestionarIdJson, convertirJson, agregarProducto, EliminarProducto, ActualizarProducto, GestionarOption}