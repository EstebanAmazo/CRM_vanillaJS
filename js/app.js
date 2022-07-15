(function () { //IIFE nos permitira que nuestras variables se mantenga solo en este archivo

    let DB;
    const listadoClientes = document.getElementById('listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        if(indexedDB.open('crm', 1)) {
            obtenerClientes();
        };

        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(ev) {
        if (ev.target.classList.contains('eliminar')) {
            
            const idEliminar = ev.target.getAttribute('data-cliente');

            Swal.fire({
                title: '¿Estas seguro de eliminar este cliente?',
                text: "Esta accion no se puede revertir!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Si, eliminalo!'
              }).then((result) => {
                if (result.isConfirmed) {
                eliminarCliente();
                  Swal.fire(
                    'Eliminado!',
                    'El registro ha sido eliminado',
                    'success'
                  )
                }
              })
            
            // const confirmar = confirm('Deseas eliminar este cliente?');
              
            function eliminarCliente () {


                const tx = DB.transaction('crm', 'readwrite');
                const objectStore = tx.objectStore('crm');
                objectStore.delete(idEliminar);
    
                tx.oncomplete = function () {
                    ev.target.parentElement.parentElement.remove();
    
    
                };
    
                tx.onerror = function (err) {
                    console.warn('error eliminando el registro', err);
                }
            }

            

            


        }
    }


    // crea la base de dados de IndexDb
    function crearDB() {
        const crearDB = indexedDB.open('crm', 1);

        crearDB.onerror = function (err) {
            console.warn(err);
        };

        crearDB.onsuccess = function () {
            DB = crearDB.result;
        };

        crearDB.onupgradeneeded = function(ev) {
            const db = ev.target.result;

            const objectStore = db.createObjectStore('crm', {
                keyPath: 'id',
                autoIncrement: true
            });

            //p1 nombre, p2 keypath, p3 propiedades
            objectStore.createIndex('nombre', 'nombre', {unique: false}) 
            objectStore.createIndex('email', 'email', {unique: false}) 
            objectStore.createIndex('telefono', 'telefono', {unique: false}) 
            objectStore.createIndex('descripcion', 'descripcion', {unique: false}) 
            objectStore.createIndex('fechaIns', 'fechaIns', {unique: false}) 
            objectStore.createIndex('fechaProd', 'fechaProd', {unique: false}) 
            objectStore.createIndex('id', 'id', {unique: true}) 

            console.log('DB lista y creada');
        };


    };

    function obtenerClientes() {
        const abrirConexion = indexedDB.open('crm', 1);

        abrirConexion.onerror = function(err) {
            console.log(err);
        };

        abrirConexion.onsuccess = function () {
            BD = abrirConexion.result;

            const objectStore = BD.transaction('crm').objectStore('crm');

            objectStore.getAll().onsuccess = function (ev) {
                let clientesArray = ev.target.result;

                clientesArray.forEach((cliente) => {
                    
                    const {nombre, email, telefono, descripcion, fechaIns, fechaProd, id} = cliente;

                    listadoClientes.innerHTML += ` <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="w-1/6 px-6 py-4  border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${descripcion}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700 text0-">    
                            <p class="text-gray-600">${fechaIns}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${fechaProd}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class=" hover:bg-blue-600 mr-5  p-2 rounded-md bg-blue-500 text-white ">Editar</a>
                            <a href="#" data-cliente="${id}" class="hover:bg-red-600 eliminar p-2 rounded-md bg-red-500 text-white ">Eliminar</a>
                        </td>
                    </tr>
                    `;

                })
            };

           
        }


            
        
        
    };


})();