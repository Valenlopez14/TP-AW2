const url = new URL(location.href)
const id_producto = url.searchParams.get('id')
const contenedor = document.getElementById('modificar')
const buttonEliminar = document.getElementById('button-eliminar')

console.log(id_producto)

function renderizarformulario(producto){
    let html = ''
    html = `
    <form id="Modificar" method="POST" action="http://localhost:3000/productos">
        <label for="nombre">Nombre:</label><br>
        <input type="text" id="nombre" name="nombre" value="${producto.nombre}"><br><br>
        <label for="categoria">Categoría:</label><br>
        <select id="categoria" name="categoria" value="${producto.categoria}">
            <option value="Perifericos">Perifericos</option>
            <option value="Hardware">Hardware</option>
            <option value="Monitores">Monitores</option>
            <option value="Sonido">Sonido</option>
        </select><br><br>
        <label for="marca">Marca:</label><br>
        <input type="text" id="marca" name="marca" value="${producto.marca}"><br><br>
        <label for="stock">Stock:</label><br>
        <input type="number" id="stock" name="stock" value= "${producto.stock}"><br><br>
        <button type="submit" >MODIFICACION</button>
    </form>
    
    `
    contenedor.innerHTML = html

    const formulario = document.getElementById('Modificar')

    formulario.addEventListener('submit', async (e)=>{
        e.preventDefault() //Previene evento de enviar
        let datosformulario = new FormData(formulario) //tipo de objeto que guarda los datos que tiene el formulario
        let datosdelFormulario = Object.fromEntries(datosformulario)
        
        const cuerpo = JSON.stringify(datosdelFormulario) // Convierte los datos en cadena de texto 
        const respuesta = await fetch(`http://localhost:3000/productos/${id_producto}`, //Fetch hace peticiones al servidor 
        {
            method: 'PUT',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: cuerpo  //carga los datos del formulario 
        }
    )
    })
}

const TraerInfoProducto = async()=>{
    try{
        const traerProducto = await fetch(`http://localhost:3000/productos/${id_producto}`)
        const producto = await traerProducto.json()
        renderizarformulario(producto)
    }
    catch(error){
        console.error('Error:', error)
    }

}
buttonEliminar.addEventListener('click', (a)=>{
    a.preventDefault()
    EliminarProducto()
})
async function EliminarProducto(){
    const producto = fetch(`http://localhost:3000/productos/${id_producto}`,
    {
        method: 'DELETE',
        headers:{'Content-Type': 'application/json;charset=utf-8'},
    })
}


TraerInfoProducto(id_producto)

