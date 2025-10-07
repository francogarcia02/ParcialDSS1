import { callProducts } from "./app.js"; // Importa la función que obtiene los productos

const form = document.getElementById("pedido-form");
const productosContainer = document.getElementById("productos-container");
const agregarProductoBtn = document.getElementById("agregar-producto-btn");
const totalInput = document.getElementById("total");

let productosDisponibles = [];

// 🔹 Cargar productos al iniciar
document.addEventListener("DOMContentLoaded", async () => {
  productosDisponibles = await callProducts();
});

// 🔹 Agregar un nuevo bloque de producto al formulario
agregarProductoBtn.addEventListener("click", () => {
  if (productosDisponibles.length === 0) {
    alert("No hay productos disponibles todavía.");
    return;
  }

  const div = document.createElement("div");
  div.classList.add("form-group");

  // Crear el select de productos
  const select = document.createElement("select");
  select.classList.add("producto-select");
  productosDisponibles.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.nombre} ($${p.precio})`;
    select.appendChild(option);
  });

  div.innerHTML = `
    <label>Producto</label>
  `;
  div.appendChild(select);

  // Cantidad
  const labelCantidad = document.createElement("label");
  labelCantidad.textContent = "Cantidad";
  const inputCantidad = document.createElement("input");
  inputCantidad.type = "number";
  inputCantidad.classList.add("producto-cantidad");
  inputCantidad.required = true;

  // Subtotal
  const labelSubtotal = document.createElement("label");
  labelSubtotal.textContent = "Subtotal";
  const inputSubtotal = document.createElement("input");
  inputSubtotal.type = "number";
  inputSubtotal.classList.add("producto-subtotal");
  inputSubtotal.readOnly = true;

  // Botón eliminar
  const btnEliminar = document.createElement("button");
  btnEliminar.type = "button";
  btnEliminar.textContent = "Eliminar";
  btnEliminar.classList.add("eliminar-producto-btn");

  div.appendChild(labelCantidad);
  div.appendChild(inputCantidad);
  div.appendChild(labelSubtotal);
  div.appendChild(inputSubtotal);
  div.appendChild(btnEliminar);

  // Eventos
  inputCantidad.addEventListener("input", () => actualizarSubtotal(div));
  select.addEventListener("change", () => actualizarSubtotal(div));
  btnEliminar.addEventListener("click", () => {
    div.remove();
    actualizarTotal();
  });

  productosContainer.appendChild(div);
});

// 🔹 Calcular subtotal según producto y cantidad
function actualizarSubtotal(div) {
  const productoId = parseInt(div.querySelector(".producto-select").value);
  const cantidad = parseFloat(div.querySelector(".producto-cantidad").value) || 0;
  const producto = productosDisponibles.find(p => p.id === productoId);

  if (!producto) return;

  const subtotal = cantidad * producto.precio;
  div.querySelector(".producto-subtotal").value = subtotal.toFixed(2);
  actualizarTotal();
}

// 🔹 Calcular el total general
function actualizarTotal() {
  const subtotales = document.querySelectorAll(".producto-subtotal");
  let total = 0;
  subtotales.forEach(s => total += parseFloat(s.value) || 0);
  totalInput.value = total.toFixed(2);
}

// 🔹 Enviar pedido al backend
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const clienteId = parseInt(document.getElementById("clienteId").value);
  const estado = document.getElementById("estado").value;
  const fecha = document.getElementById("fecha").value;
  const total = parseFloat(totalInput.value);

  const productos = Array.from(productosContainer.children).map(div => {
    const productoId = parseInt(div.querySelector(".producto-select").value);
    const cantidad = parseInt(div.querySelector(".producto-cantidad").value);
    const producto = productosDisponibles.find(p => p.id === productoId);
    return {
      productoId,
      cantidad,
      precioUnitario: producto.precio,
      subtotal: cantidad * producto.precio
    };
  });

  const pedido = { clienteId, estado, fecha, total, productos };

  console.log("Pedido a enviar:", pedido);

  const response = await fetch("http://localhost:3000/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido)
  });

  const data = await response.json();
  console.log(data);

  if (response.ok) {
    alert("Pedido creado con éxito");
    form.reset();
    productosContainer.innerHTML = "";
    totalInput.value = "";
  } else {
    alert("Error al crear pedido");
  }
});
