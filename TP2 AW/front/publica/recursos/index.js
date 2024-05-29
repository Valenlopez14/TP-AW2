const formulario = document.getElementById('contenedor')


const ProdJSON= async()=>{
    const datos = await fetch("http://localhost:3000/productos")
    const productos = await datos.json()
   renderizar(productos)
}



const renderizar  = (productos)=>{
    let html = ''
    productos.productos.forEach((producto)=>{
        html += `
        <article> 
           <h2> Nombre: ${producto.nombre} </h2>
           <br>
           <a href="gestionar.html?id=${producto.id}"> Administrar</a>
           <br>
           <p> Marca: ${producto.marca}</p>
           <br>
           <p>Categoria: ${producto.categoria}</p>
           <br>
           <p> Stock:${producto.stock}</p>
          
           <h3>**********************************************************************************</h3>
        </article>
        `
    })
    formulario.innerHTML=html

}



ProdJSON()
