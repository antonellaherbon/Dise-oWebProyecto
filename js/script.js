document.addEventListener('DOMContentLoaded', function() {

    //obtener elementos HTML
    const menu = document.getElementById('menu');
    const modalBodyCarrito = document.getElementById('modal-bodyCarrito');
    const precioTotalElement = document.getElementById('precioTotal');

    //inicializo array vacio para el carrito
    let carrito = [];

    function renderizarCarrito() {
        modalBodyCarrito.innerHTML = '';

        //recorrer cada elemento de carrito, crear un div y añadirles class. Luego, se le agrega elemento HTML y mediante appendChild, se lo añade al HTML
        carrito.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('d-flex', 'justify-content-between', 'mb-2');
            itemElement.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="../assets/${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                    <p>${item.nombre}</p>
                </div>
                <p>$${item.precio}</p>
            `;
            modalBodyCarrito.appendChild(itemElement);
        });

        const precioTotal = carrito.reduce((total, item) => total + item.precio, 0);
        precioTotalElement.textContent = `Total: $${precioTotal.toFixed(2)}`;
    }

    function agregarAlCarrito(producto) {
        carrito.push(producto);

        //lo guardo en el localStorage para no perderlo si recargo la pagina o se cierra.
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    }

    function vaciarCarrito() {
        carrito = [];
        localStorage.removeItem('carrito');
        renderizarCarrito();
    }

    const botonVaciarCarrito = document.getElementById('botonVaciarCarrito');
    botonVaciarCarrito.addEventListener('click', function(){
        Swal.fire({
            title: "Estas seguro?",
            text: "Tu carrito no volverá a aparecer!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, estoy seguro!"
            }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito()
            }
        });
    });

    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        renderizarCarrito();
    }

    fetch('../hamburguesas.json')
        .then(response => response.json())
        .then(data => {
            data.hamburguesas.forEach(hamburguesa => {
                const col = document.createElement('div');
                col.classList.add('col-lg-6', 'mb-4');
                col.innerHTML = `
                <div class="card mb-3" >
                    <div class="row no-gutters h-100">
                        <div class="col-md-4">
                            <div class="img-container h-100">
                                <img src="../assets/${hamburguesa.imagen}" class="card-img" alt="...">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="card-body d-flex flex-column justify-content-between h-100">
                                <h5 class="card-title">${hamburguesa.nombre}</h5>
                                <p class="card-text">${hamburguesa.descripcion}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <p class="card-text"><small class="text-muted">$${hamburguesa.precio}</small></p>
                                    <button class="btn btn-orange agregar-carrito" data-precio="${hamburguesa.precio}" data-nombre="${hamburguesa.nombre}" data-imagen="${hamburguesa.imagen}">🛒</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                menu.appendChild(col);
            });

            const botonesAgregarCarrito = document.getElementsByClassName('agregar-carrito');
            for (let i = 0; i < botonesAgregarCarrito.length; i++) {
                botonesAgregarCarrito[i].addEventListener('click', function() {
                    //obtengo los datos que quiero pushear al carrito

                    const nombre = this.getAttribute('data-nombre');
                    const precio = parseFloat(this.getAttribute('data-precio'));
                    const imagen = this.getAttribute('data-imagen');
                    const producto = { nombre, precio, imagen };
                    agregarAlCarrito(producto);
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto agregado al carrito',
                        showConfirmButton: false,
                        timer: 1500 
                    });
                });
            }

            const botonComprar = document.getElementById('botonFinalizarCompra');
            botonComprar.addEventListener('click',function(){
                Swal.fire({
                    icon: 'success',
                    title: 'Compra realizada con éxito',
                    showConfirmButton: false,
                    timer: 1500
                });
                vaciarCarrito();
            });
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
});
