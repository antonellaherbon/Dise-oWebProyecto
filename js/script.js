$(document).ready(function() { // el código se ejecute una vez que el documento esté cargado.

    // Obtener elementos HTML
    const $menu = $('#menu');
    const $modalBodyCarrito = $('#modal-bodyCarrito');
    const $precioTotalElement = $('#precioTotal');

    // Inicializar array vacío para el carrito
    let carrito = [];

    function renderizarCarrito() {
        $modalBodyCarrito.empty();

        // Recorrer cada elemento del carrito, crear un div y añadirles clases. Luego, agregar el elemento HTML y añadirlo al HTML mediante append
        carrito.forEach(item => {
            const itemElement = $(`
                <div class="d-flex justify-content-between mb-2">
                    <div class="d-flex align-items-center">
                        <img src="../assets/${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                        <p>${item.nombre}</p>
                    </div>
                    <p>$${item.precio}</p>
                </div>
            `);
            $modalBodyCarrito.append(itemElement);
        });

        const precioTotal = carrito.reduce((total, item) => total + item.precio, 0);
        $precioTotalElement.text(`Total: $${precioTotal.toFixed(2)}`);
    }

    function agregarAlCarrito(producto) {
        carrito.push(producto);

        // Guardar en el localStorage para no perderlo si recargo la página o se cierra.
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    }

    function vaciarCarrito() {
        carrito = [];
        localStorage.removeItem('carrito');
        renderizarCarrito();
    }

    const $botonVaciarCarrito = $('#botonVaciarCarrito');
    $botonVaciarCarrito.click(function(){
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Tu carrito no volverá a aparecer!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, estoy seguro!"
        }).then((result) => {
            if (result.isConfirmed) {
                vaciarCarrito();
            }
        });
    });

    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        renderizarCarrito();
    }

    //cargar los productos del menú desde un JSON y genera dinámicamente los elementos.
    $.getJSON('../hamburguesas.json', function(data) { 
        data.hamburguesas.forEach(hamburguesa => {
            const col = $(`
                <div class="col-lg-6 mb-4">
                    <div class="card mb-3">
                        <div class="row no-gutters h-100">
                            <div class="col-md-4">
                                <div class="img-container h-100">
                                    <img src="../assets/${hamburguesa.imagen}" class="card-img" loading="lazy" alt="hamburguesa">
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
                </div>
            `);
            $menu.append(col);
        });

        $('.agregar-carrito').click(function() {
            // Obtener los datos que quiero pushear al carrito
            const nombre = $(this).data('nombre');
            const precio = parseFloat($(this).data('precio'));
            const imagen = $(this).data('imagen');
            const producto = { nombre, precio, imagen };
            agregarAlCarrito(producto);
            Swal.fire({
                icon: 'success',
                title: 'Producto agregado al carrito',
                showConfirmButton: false,
                timer: 1500
            });
        });

        $('#botonFinalizarCompra').click(function(){
            Swal.fire({
                icon: 'success',
                title: 'Compra realizada con éxito',
                showConfirmButton: false,
                timer: 1500
            });
            vaciarCarrito();
        });
    }).fail(function(error) {
        console.error('Error al cargar el JSON:', error);
    });
});
