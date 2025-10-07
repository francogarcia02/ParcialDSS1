import { createProduct, deleteProduct, fetchProductos, updateProduct } from "./api.js";

const productosList = document.getElementById("productos-list");

function renderProductos(productos) {
  productosList.innerHTML = ""; 

  productos.forEach(producto => {
    const li = document.createElement("li");
    li.textContent = `Nombre: ${producto.nombre} - Precio: ${producto.precio} - Stock: ${producto.stock}`;
    
    const btnActualizar = document.createElement("button");
    btnActualizar.textContent = "Actualizar";
    btnActualizar.addEventListener("click", () => abrirModal(producto));
    li.appendChild(btnActualizar);
    
    const btn = document.createElement("button");
    btn.textContent = "Eliminar";
    btn.addEventListener("click", () => {
      eliminarProducto(producto.id);
    });

    li.appendChild(btn);
    productosList.appendChild(li);
  });
}

function eliminarProducto(id) {
    const deleteP = deleteProduct({productoId: id})
    const products = callProducts()
}

const productoForm = document.getElementById("producto-form");

productoForm.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    const nombre = document.getElementById("nombre").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const stock = parseInt(document.getElementById("stock").value);
    const estado = document.getElementById("estado").value;

    const create = await createProduct({nombre, precio, stock, estado})
    const products = callProducts()
});

const updateModal = document.getElementById("update-modal");
const closeModal = document.getElementById("close-modal");
const updateForm = document.getElementById("update-form");

function abrirModal(producto) {
    document.getElementById("update-id").value = producto.id;
    document.getElementById("update-nombre").value = producto.nombre;
    document.getElementById("update-precio").value = producto.precio;
    document.getElementById("update-stock").value = producto.stock;
    document.getElementById("update-estado").value = producto.estado;

    updateModal.style.display = "block";
}

closeModal.onclick = () => updateModal.style.display = "none";
window.onclick = (e) => {
  if (e.target == updateModal) updateModal.style.display = "none";
};

updateForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productoActualizado = {
        productoId: parseInt(document.getElementById("update-id").value),
        nombre: document.getElementById("update-nombre").value,
        precio: parseFloat(document.getElementById("update-precio").value),
        stock: parseInt(document.getElementById("update-stock").value),
        estado: document.getElementById("update-estado").value
    };

    await updateProduct({
        productoId: productoActualizado.productoId, 
        nombre: productoActualizado.nombre, 
        precio: productoActualizado.precio, 
        stock: productoActualizado.stock, 
        estado: productoActualizado.estado, 
    });

    updateModal.style.display = "none";
    const products = callProducts()
});

const callProducts = async () => {
    const productos = await fetchProductos();

    if(productos.length >= 1) {
        renderProductos(productos)
        return productos      
    }
}


const products = callProducts()
