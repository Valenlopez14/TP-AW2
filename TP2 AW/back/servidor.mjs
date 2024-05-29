import http from 'node:http'
import fsp from 'node:fs/promises'
import path from 'node:path'

import {GestionarJSON, GestionarIdJson, agregarProducto, EliminarProducto, ActualizarProducto, GestionarOption} from './funcionalidades.mjs';

const servidor = http.createServer((peticion, respuesta)=>{


    if (peticion.method === 'GET')
        {
            if(peticion.url === '/productos')
                {
                      GestionarJSON(respuesta)
                }
            else if(peticion.url.match('/productos')){
                GestionarIdJson(peticion, respuesta)
            }
        }

    else if(peticion.method === 'POST')
        {
            if(peticion.url === '/productos')
                {
                    agregarProducto(peticion,respuesta)
                }
            else{
                respuesta.statusCode = 404
                respuesta.sendHeader('Content-Type', 'text/plain')
                respuesta.end("URL no encontrada")
            }
        }

    else if(peticion.method === 'PUT')
        {
            if(peticion.url.match('/productos')){
                ActualizarProducto(peticion, respuesta)
            }
        }

    else if (peticion.method === 'DELETE')
        {
            if(peticion.url.match('/productos')){
               EliminarProducto(peticion,respuesta)
            }
            else{
                respuesta.statusCode = 404
                respuesta.setHeader('Content-Type', 'text/plain')
                respuesta.end("URL no encontrada")
            }
        }
    else if(peticion.method === 'OPTIONS'){
        if(peticion.url.match('/productos')){
            GestionarOption(respuesta)
        }
        else{
            respuesta.statusCode = 404
            respuesta.sendHeader('Content-Type', 'text/plain')
            respuesta.end("URL no encontrada")
        }
    }

    else{
        respuesta.statusCode= 404;
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("Metodo no encontrado")
    }
})

servidor.listen(3000)