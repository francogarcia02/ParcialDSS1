const form = document.getElementById("pedido-form");
const productosContainer = document.getElementById("productos-container");
const agregarProductoBtn = document.getElementById("agregar-producto-btn");
const totalInput = document.getElementById("total");

let productos = [];

agregarProductoBtn.addEventListener("click", () => {
  const index = productos.length;

  const div = document.createElement("div");
  div.classList.add("form-group");

  div.innerHTML = `
    <label>Producto ID</label>
    <input type="number" class="producto-id" required>

    <label>Cantidad</label>
    <input type="number" class="producto-cantidad" required>

    <label>Precio Unitario</label>
    <input type="number" class="producto-precio" required>

    <label>Subtotal</label>
    <input type="number" class="producto-subtotal" readonly>

    <button type="button" class="eliminar-producto-btn">Eliminar</button>
  `;

  // Eliminar producto del listado
  div.querySelector(".eliminar-producto-btn").addEventListener("click", () => {
    div.remove();
    actualizarTotal();
  });

  // Actualizar subtotal dinámicamente
  div.querySelector(".producto-cantidad").addEventListener("input", actualizarSubtotal);
  div.querySelector(".producto-precio").addEventListener("input", actualizarSubtotal);

  productosContainer.appendChild(div);
});

function actualizarSubtotal(e) {
  const contenedor = e.target.closest(".form-group");
  const cantidad = parseFloat(contenedor.querySelector(".producto-cantidad").value) || 0;
  const precio = parseFloat(contenedor.querySelector(".producto-precio").value) || 0;
  const subtotal = cantidad * precio;

  contenedor.querySelector(".producto-subtotal").value = subtotal.toFixed(2);

  actualizarTotal();
}

function actualizarTotal() {
  const subtotales = document.querySelectorAll(".producto-subtotal");
  let total = 0;
  subtotales.forEach(s => total += parseFloat(s.value) || 0);
  totalInput.value = total.toFixed(2);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const clienteId = parseInt(document.getElementById("clienteId").value);
  const estado = document.getElementById("estado").value;
  const fecha = document.getElementById("fecha").value;
  const total = parseFloat(totalInput.value);

  const productos = Array.from(productosContainer.children).map(div => ({
    productoId: parseInt(div.querySelector(".producto-id").value),
    cantidad: parseInt(div.querySelector(".producto-cantidad").value),
    precioUnitario: parseFloat(div.querySelector(".producto-precio").value),
    subtotal: parseFloat(div.querySelector(".producto-subtotal").value)
  }));

  const pedido = { clienteId, estado, fecha, total, productos };

  console.log("Pedido a enviar:", pedido);

  // Envío al backend
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
