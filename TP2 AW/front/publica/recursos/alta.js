const formulario = document.getElementById('Agregar')

formulario.addEventListener('submit', async (e)=>{
    console.log("asd")
    e.preventDefault()
    let datosformulario = new FormData(formulario) //tipo de objeto que guarda los datos que tiene el formulario
    let datosdelFormulario = Object.fromEntries(datosformulario)
    
    const cuerpo = JSON.stringify(datosdelFormulario)
    const respuesta = await fetch('http://localhost:3000/productos',
    {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: cuerpo
    }
)
})

