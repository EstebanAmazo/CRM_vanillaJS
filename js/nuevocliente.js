import {uid} from './uid.js'
(function(){
    
    let DB;
    const formualrio = document.getElementById('formulario');

    document.addEventListener('DOMContentLoaded', () =>{

        conectarDB();
        formualrio.addEventListener('submit', validarCliente);
    })

    function conectarDB() {
        const abrirConexion = indexedDB.open('crm', 1);

        abrirConexion.onerror = function (err) {
            console.warn(err);
        };

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        };

    };

    function validarCliente(ev) {
        ev.preventDefault();    
        // leer los inputs 

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const descripcion = document.getElementById('descripcion').value
        const fechaIns = document.getElementById('fecha-instrumental').value
        const fechaProd = document.getElementById('fecha-produccion').value

        if([nombre, telefono, descripcion, fechaProd].includes('')){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Faltan campos por llenar!',
                footer: '<a href="">Revisa los campos marcados con (*)</a>'
              });

            return;
        };

        // Crear un objeto con la informacion 

        const cliente = {
            nombre,
            email,
            telefono,
            descripcion,
            fechaIns,
            fechaProd,
            id: uid()
        }
        
        crearNuevoCliente(cliente);
    };

    function crearNuevoCliente(cliente) {
        const tx = DB.transaction('crm', 'readwrite');

        const objectStore = tx.objectStore('crm');

        objectStore.add(cliente);

        tx.onerror = function (err) {
            imprimirAlerta('Hubo un error', 'error')
        }
        
        tx.oncomplete = function () {
            console.log('cliente agregado')
            let timerInterval
            Swal.fire(
                'Bien!',
                'El cliente se agrego correctamente!',
                'success'
              ).then((result) =>{
                if(result.isConfirmed){
                  window.location.href = 'index.html';
                }
            })

            setTimeout(()=>{
                // cuando se agregue el cliente vamos a la venta de cliente
                // window.location.href = 'index.html';
            }, 3000);
        };
    };

    function imprimirAlerta(mensaje, tipo) {

        const alerta = document.querySelector('.alerta');

        if(!alerta) {

            // crear la alerta
            const divMensaje =  document.createElement('div');
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
    
            if(tipo === 'error') {
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else {
                divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            };
    
            divMensaje.textContent = mensaje;
            formualrio.appendChild(divMensaje);
    
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        };

    
    };











})();