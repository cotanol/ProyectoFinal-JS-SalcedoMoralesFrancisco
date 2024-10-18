document.addEventListener("DOMContentLoaded", () => {
    let productosEnCarrito = JSON.parse(localStorage.getItem("productosCarrito")) || [];

    actualizarNumeroCarrito();
    mostrarProductosEnCarrito();
    cargarProductos(); // Cargar productos al iniciar

    const abrirCarrito = document.querySelector("#cart");
    const cerrarCarrito = document.querySelector("#cerrarCarrito");
    const carritoContainer = document.querySelector("#cartContainer");

    abrirCarrito.addEventListener("click", () => {
        carritoContainer.style.right = "0";
    });

    cerrarCarrito.addEventListener("click", () => {
        carritoContainer.style.right = "-500px";
    });

    function cargarProductos() {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(data => {
                const rutaActual = window.location.pathname;
                // Si estamos en el index, solo mostramos 4 productos
                if (rutaActual.includes('index.html') || rutaActual === '/') {
                    mostrarProductosEnPagina(data.slice(0, 4)); // Mostrar solo 4 productos
                } else if (rutaActual.includes('productos.html')) {
                    mostrarProductosEnPagina(data); // Mostrar todos los productos
                }
            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
            });
    }

    function mostrarProductosEnPagina(productos) {
        const contenedorProductos = document.querySelector("#contenedorProductos");
        contenedorProductos.innerHTML = '';

        productos.forEach(producto => {
            const productoHTML = `
                <div class="col-md-6 col-lg-3 mb-4">
                    <div class="card background-fondo color-section contenedor-producto">
                        <div class="contenedor-imagen-producto">
                            <img src="${producto.image}" class="card-img-top producto-imagen" alt="${producto.title}">
                        </div>
                        <div class="card-body producto-caract">
                            <h3 class="card-title producto-nombre">${producto.title}</h3>
                            <p class="card-text producto-precio">$${producto.price}</p>
                            <a class="boton" data-id="${producto.id}" data-nombre="${producto.title}" data-precio="${producto.price}" data-img="${producto.image}">Comprar</a>
                        </div>
                    </div>
                </div>
            `;
            contenedorProductos.innerHTML += productoHTML;
        });

        document.querySelectorAll(".boton").forEach(boton => {
            boton.addEventListener("click", (e) => {
                e.preventDefault();
                const idProducto = boton.getAttribute("data-id");
                const nombreProducto = boton.getAttribute("data-nombre");
                const precioProducto = boton.getAttribute("data-precio");
                const imgProducto = boton.getAttribute("data-img");

                agregarAlCarrito(idProducto, nombreProducto, precioProducto, imgProducto);
            });
        });
    }

    // Resto de tus funciones (agregarAlCarrito, actualizarNumeroCarrito, mostrarProductosEnCarrito, eliminarProductoDelCarrito, etc.)

    function agregarAlCarrito(id, nombre, precio, img) {
        const productoExistente = productosEnCarrito.find(producto => producto.id === id);

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            productosEnCarrito.push({
                id,
                nombre,
                precio: parseFloat(precio),
                img,
                cantidad: 1
            });
        }

        localStorage.setItem("productosCarrito", JSON.stringify(productosEnCarrito));
        actualizarNumeroCarrito();
        mostrarProductosEnCarrito();
    }

    function actualizarNumeroCarrito() {
        const numeroProductos = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        const carritoIcono = document.querySelector("#cart-count");
        if (carritoIcono) {
            carritoIcono.innerText = `(${numeroProductos})`;
        }
    }

    function mostrarProductosEnCarrito() {
        const contenedorCarrito = document.querySelector(".productos-carrito-conteiner");
        const carritoVacioMensaje = document.querySelector("#carritoVacio");
        const totalCarritoElemento = document.querySelector("#totalCarrito");
        let totalCarrito = 0;

        contenedorCarrito.innerHTML = '';

        if (productosEnCarrito.length === 0) {
            carritoVacioMensaje.style.display = 'block';
            totalCarritoElemento.innerText = '$0';
        } else {
            carritoVacioMensaje.style.display = 'none';
            productosEnCarrito.forEach(producto => {
                const divProducto = document.createElement("div");
                divProducto.classList.add("carrito-producto");
                divProducto.innerHTML = `
                    <img src="${producto.img}" alt="${producto.nombre}" style="width: 100px;">
                    <div class="carrito-producto-detalles">
                        <div class="fila-producto nombre-producto">
                            <h4>${producto.nombre}</h4>
                        </div>
                        <div class="fila-producto precio-cantidad">
                            <p>$${producto.precio}</p>
                            <p>x${producto.cantidad}</p>
                        </div>
                        <div class="fila-producto precio-total">
                            <p>Total: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
                        </div>
                        <div class="fila-producto boton-eliminar">
                            <button class="eliminar-producto" data-id="${producto.id}">Eliminar</button>
                        </div>
                    </div>
                `;

                totalCarrito += producto.precio * producto.cantidad;
                contenedorCarrito.appendChild(divProducto);
            });

            totalCarritoElemento.innerText = `$${totalCarrito.toFixed(2)}`;

            document.querySelectorAll(".eliminar-producto").forEach(boton => {
                boton.addEventListener("click", (e) => {
                    eliminarProductoDelCarrito(e.target.getAttribute("data-id"));
                });
            });
        }
    }

    function eliminarProductoDelCarrito(idProducto) {
        productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== idProducto);
        localStorage.setItem("productosCarrito", JSON.stringify(productosEnCarrito));
        mostrarProductosEnCarrito();
        actualizarNumeroCarrito();
    }

    document.querySelector("#pagarCarrito").addEventListener("click", () => {
        if (productosEnCarrito.length > 0) {
            alert("Compra realizada con éxito.");
            productosEnCarrito = [];
            localStorage.removeItem("productosCarrito");
            mostrarProductosEnCarrito();
            actualizarNumeroCarrito();
        } else {
            alert("El carrito está vacío.");
        }
    });
});