(function() {
    let DB;
    let idCliente;
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const descripcionInput = document.getElementById('descripcion');
    const fechaInsInput = document.getElementById('fecha-instrumental');
    const fechaProdInput = document.getElementById('fecha-produccion');

    const formulario = document.getElementById('formulario');
    

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        //actualiza el registro
        formulario.addEventListener('submit', actualizarCliente);
        

        // Verificar el Id de la Url
        const parametrosURL = new URLSearchParams(window.location.search);

        idCliente = parametrosURL.get('id');
        if(idCliente) {
            // la base de datos tarda un tiempo en estar lista (solucionar con async )
            setTimeout(() => {
                obtenerCliente(idCliente); 
                
            }, 100);
        }

    });

    function actualizarCliente(ev) {
        ev.preventDefault();
        
        if(nombreInput.value === '' || descripcionInput.value === '' || telefonoInput.value === '' || fechaProdInput.value === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Faltan campos por llenar!',
                footer: '<a href="">Revisa los campos marcados con (*)</a>'
              });

            return;
        };

        // actualizar cliente

        const clienteActualizado = {
            nombre : nombreInput.value,
            email : emailInput.value,
            telefono : telefonoInput.value,
            descripcion : descripcionInput.value,
            fechaIns : fechaInsInput.value,
            fechaProd : fechaProdInput.value,
            id : idCliente
        }

        const tx = DB.transaction('crm', 'readwrite');
        const objectStore = tx.objectStore('crm');

        objectStore.put(clienteActualizado);

        tx.oncomplete = function () {
            Swal.fire(
                'Bien!',
                'Datos Actualizados!',
                'success'   
              ).then((result) =>{
                  if(result.isConfirmed){
                    window.location.href = 'index.html';
                  }
              })
            setTimeout(()=>{
                // cuando se agregue el cliente vamos a la venta de cliente
                
            }, 3000);
        }

        tx.onerror = function (err) {
            console.warn('error al actualizar datos', err);
        }
    };

    function obtenerCliente(id) {
        const tx = DB.transaction('crm', 'readwrite');
        const objectStore = tx.objectStore('crm')
        
        const cliente = objectStore.getAll();
        cliente.onsuccess = function (ev) {
            const clienteArray = ev.target.result;

            clienteArray.forEach((cliente) =>{
                if(cliente.id === id) {
                    
                    llenarFormulario(cliente);
                };
            });

        };
    };

    function llenarFormulario(cliente) {
        const {nombre, email, telefono, descripcion, fechaIns, fechaProd} = cliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        descripcionInput.value = descripcion;
        fechaInsInput.value = fechaIns;
        fechaProdInput.value = fechaProd;
    };

    function conectarDB(){
        const abrirConexion = indexedDB.open('crm', 1);

        abrirConexion.onerror = function (err) {
            console.warn(err);
        };

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        };
    }


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
            formulario.appendChild(divMensaje);
    
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        };

    
    };







})();