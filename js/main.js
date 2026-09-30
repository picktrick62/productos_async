const productosIniciales = [
  { id: 1, nombre: "Teclado mecánico", precio: 950 },
  { id: 2, nombre: "Mouse inalámbrico", precio: 480 },
  { id: 3, nombre: "Monitor de 24 pulgadas", precio: 3800 }
];

const CLAVE_STORAGE = "productos";

function cargarProductos() {
  try {
    const guardados = localStorage.getItem(CLAVE_STORAGE);
    return guardados ? JSON.parse(guardados) : productosIniciales;
  } catch (error) {
    return productosIniciales;
  }
}

let productos = cargarProductos();

function guardarProductos() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos));
}

const inputNombre = document.querySelector("#input-nombre");
const inputPrecio = document.querySelector("#input-precio");
const btnAgregar  = document.querySelector("#btn-agregar");
const inputBuscar = document.querySelector("#input-buscar");
const mensaje     = document.querySelector("#mensaje");
const contenedor  = document.querySelector("#contenedor-items");
const banner      = document.querySelector("#banner-cotizacion");

function mostrarMensaje(texto, color = "#27ae60") {
  mensaje.textContent = texto;
  mensaje.style.color = color;
  setTimeout(() => { mensaje.textContent = ""; }, 2000);
}

function renderizar(lista = productos) {
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = "<p style='text-align:center;color:#888;'>No hay productos para mostrar.</p>";
    return;
  }

  lista.forEach(({ id, nombre, precio }) => {
    const div = document.createElement("div");
    div.classList.add("item");

    const precioFormateado = typeof precio === "number"
      ? precio.toLocaleString("es-MX")
      : "0";

    div.innerHTML = `
      <div>
        <h3>${nombre ?? "Sin nombre"}</h3>
        <p>$${precioFormateado} MXN</p>
      </div>
      <button class="btn-eliminar" data-id="${id}">Eliminar</button>
    `;

    contenedor.appendChild(div);
  });
}

setTimeout(() => {
  banner.textContent = "🔔 Cotización del dólar hoy: $18.50 MXN";
  banner.classList.add("visible");
}, 3000);

btnAgregar.addEventListener("click", () => {
  try {
    const nombre = inputNombre.value.trim();
    const precio = Number(inputPrecio.value);

    if (nombre === "" || isNaN(precio) || precio <= 0) {
      throw new Error("Datos inválidos");
    }

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      precio
    };

    const { nombre: nom } = nuevoProducto;

    productos.push(nuevoProducto);
    guardarProductos();
    renderizar();
    mostrarMensaje(`✔ Producto "${nom}" agregado`);

    inputNombre.value = "";
    inputPrecio.value = "";
    inputNombre.focus();

  } catch (error) {
    mostrarMensaje("⚠ No se pudo procesar la operación, inténtalo de nuevo", "#e74c3c");
  } finally {
    inputNombre.style.borderColor = "#ccc";
  }
});

contenedor.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-eliminar")) return;

  try {
    const id = Number(e.target.dataset.id);
    const indice = productos.findIndex(p => p.id === id);

    if (indice === -1) {
      throw new Error("Producto no encontrado");
    }

    const { nombre } = productos[indice];
    productos.splice(indice, 1);
    guardarProductos();
    renderizar();
    mostrarMensaje(`🗑 "${nombre}" eliminado`, "#e67e22");

  } catch (error) {
    mostrarMensaje("⚠ No se pudo eliminar el producto", "#e74c3c");
  } finally {
    mensaje.style.opacity = "1";
  }
});

inputBuscar.addEventListener("keyup", () => {
  const texto = inputBuscar.value.toLowerCase();
  const filtrados = productos.filter(({ nombre }) =>
    nombre.toLowerCase().includes(texto)
  );
  renderizar(filtrados);
});

const btnVaciar = document.createElement("button");
btnVaciar.id = "btn-vaciar";
btnVaciar.textContent = "🗑 Vaciar todo";
document.querySelector(".formulario").after(btnVaciar);

btnVaciar.addEventListener("click", () => {
  try {
    if (productos.length === 0) {
      throw new Error("Lista vacía");
    }
    productos = [];
    localStorage.removeItem(CLAVE_STORAGE);
    renderizar();
    mostrarMensaje("🧹 Lista vaciada", "#e67e22");

  } catch (error) {
    mostrarMensaje("La lista ya está vacía", "#888");
  } finally {
    inputBuscar.value = "";
  }
});

renderizar();