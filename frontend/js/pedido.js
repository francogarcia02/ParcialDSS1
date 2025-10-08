import { createPedido, fetchProductos, fetchClientes, fetchPedidos, deletePedido, updatePedido, deletePedidoItem, createPedidosItems } from "./api.js";

const form = document.getElementById("pedido-form");
const productosContainer = document.getElementById("productos-container");
const agregarProductoBtn = document.getElementById("agregar-producto-btn");
const totalInput = document.getElementById("total");

// 🔹 Cargar clientes al iniciar
const clienteSelect = document.getElementById("clienteSelect");

const cargarClientes = async () => {
  const clientes = await fetchClientes();
  clienteSelect.innerHTML = '<option value="">Seleccione un cliente</option>';

  clientes.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.nombre;
    clienteSelect.appendChild(option);
  });
};

// Aca se cargan los productos tambien

let productosDisponibles = [];

document.addEventListener("DOMContentLoaded", async () => {
  productosDisponibles = await fetchProductos();
  await cargarClientes();
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


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const clienteId = parseInt(clienteSelect.value);
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

  const response = await createPedido(pedido);
  if (response) {
    form.reset();
    productosContainer.innerHTML = "";
    totalInput.value = "";
  } else {
    alert("Error al crear pedido");
  }
  const pedidos = await callPedidos()
  renderPedidos(pedidos)
});


const pedidosList = document.getElementById("pedidos-list");

function renderPedidos(pedidos) {
  const pedidosList = document.getElementById("pedidos-list");
  pedidosList.innerHTML = ""; 

  pedidos.forEach(pedido => {
    const container = document.createElement("div");
    container.classList.add("pedido-container");

    container.innerHTML = `
      <div class="pedido-subcontainer">
        <div class="pedido-item">
          <p class="pedido-title">Cliente:</p>
          <p>${pedido.Cliente?.nombre || "-"}</p>
        </div>
        <div class="pedido-item">
          <p class="pedido-title">Total:</p>
          <p>$${pedido.total}</p>
        </div>
        <div class="pedido-item">
          <p class="pedido-title">Fecha:</p>
          <p>${new Date(pedido.date).toISOString().slice(0,10)}</p>
        </div>
        <div class="pedido-item">
          <p class="pedido-title">Estado:</p>
          <p>${pedido.estado}</p>
        </div>
      </div>
      <div>
        <p class="pedido-product-list-title">Productos:</p>
        <div class="pedido-product-list"></div>
      </div>
      <div class="pedido-actions">
        <button 
        class="btn-actualizar"
        >
          Actualizar
        </button>
        <button class="btn-eliminar">Eliminar</button>
      </div>
    `;

    // Lista de productos del pedido
    const productContainer = container.querySelector(".pedido-product-list");
    pedido.Pedido_Items?.forEach((producto, index) => {
      const productoItem = document.createElement("div");
      productoItem.classList.add("pedido-subcontainer"); // cada producto en su subcontainer

      productoItem.innerHTML = `
        <div class="pedido-item">
          <p class="pedido-title">${index + 1}</p>
        </div>
        <div class="pedido-item">
          <p class="pedido-title">Producto:</p>
          <p>${producto.Producto?.nombre || "-"}</p>
        </div>
        <div class="pedido-item">
          <p class="pedido-title">Cantidad:</p>
          <p>${producto.cantidad}</p>
        </div>
        <div class="pedido-item">
          <p class="pedido-title">Precio unitario:</p>
          <p>$${producto.precioUnitario}</p>
        </div>
        <div class="pedido-item">
          <p class="pedido-title">Subtotal:</p>
          <p>$${producto.subtotal}</p>
        </div>
      `;

      productContainer.appendChild(productoItem);
    });
    // Botones
    const btnActualizar = container.querySelector(".btn-actualizar");
    const btnEliminar = container.querySelector(".btn-eliminar");

    btnActualizar.addEventListener("click", () => abrirModal(pedido));
    btnEliminar.addEventListener("click", () => eliminarPedido(pedido.id));

    pedidosList.appendChild(container);
  });
}

// Función para abrir modal y cargar datos del pedido
const abrirModal = (pedido) => {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Actualizar Pedido #${pedido.id}</h2>
      <form class="itemsContainer" id="form-update">
        <div class="form-group">
          <label for="clienteSelectModal">Cliente</label>
          <select id="clienteSelectModal"></select>
        </div>

        <div class="form-group">
          <label for="estadoModal">Estado</label>
          <select id="estadoModal" required>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div class="form-group">
          <label for="fechaModal">Fecha</label>
          <input type="date" id="fechaModal" value="${pedido.date.slice(0,10)}"/>
        </div>

        <button type="submit">Guardar Cambios</button>
      </form>

      <h3>Productos existentes</h3>
      <div id="productosContainerModal"></div>

      <h3>Agregar productos</h3>
      <button type="button" id="agregarProductoModal" class="btn-add">+ Agregar Producto</button>
      <div id="newProductsContainer"></div>

      <div class="form-group">
        <label>Total</label>
        <input type="number" id="totalModal" value="${pedido.total}" readonly />
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = "block";

  // Cerrar modal
  modal.querySelector(".close").addEventListener("click", () => modal.remove());

  const clienteSelect = modal.querySelector("#clienteSelectModal");
  fetchClientes().then(clientes => {
    clientes.forEach(c => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = c.nombre;
      if(c.id === pedido.clienteId) option.selected = true;
      clienteSelect.appendChild(option);
    });
  });

  let newTotal = pedido.total;
  const totalInput = modal.querySelector("#totalModal");

  // ---------- Productos existentes ----------
  const productosContainer = modal.querySelector("#productosContainerModal");
  pedido.Pedido_Items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("form-group");
    div.innerHTML = `
      <p><strong>Producto:</strong> ${item.Producto.nombre}</p>
      <p><strong>Cantidad:</strong> ${item.cantidad}</p>
      <p><strong>Subtotal:</strong> $${item.subtotal}</p>
      <button type="button" class="eliminar-producto-btn">Eliminar</button>
    `;
    productosContainer.appendChild(div);

    const btnEliminar = div.querySelector(".eliminar-producto-btn");
    
    btnEliminar.addEventListener("click", async () => { 
      const success = eliminarPedidoItem(item.id) 
      if(success) { 
        div.remove(); 
        newTotal -= item.subtotal 
        document.getElementById("totalModal").value = newTotal; 
        const clienteId = parseInt(clienteSelect.value); 
        const estado = document.getElementById("estadoModal").value; 
        const fecha = document.getElementById("fechaModal").value; 
        const pedidoId = pedido.id; 
        if (pedidoId && clienteId && estado && fecha) { 
          const update = await updatePedido({ 
            pedidoId: pedidoId, 
            clienteId: clienteId, 
            fecha: fecha, 
            estado: estado, 
            total: newTotal 
          }); 
          if (update) { 
            const pedidos = await callPedidos(); 
            renderPedidos(pedidos); 
            /*modal.remove();*/ //Lo deje comentado porque no me decidia si es mejor cerrar el modal o dejarlo abierto para la comodidad del usuario } } } })
          }
        }
      }    
    });
  })
  // ---------- Agregar nuevos productos ----------
  const btnAddItem = modal.querySelector('.btn-add');
  const newProductsContainer = modal.querySelector('#newProductsContainer');

  btnAddItem.addEventListener('click', () => {
    const div = document.createElement('div');
    div.classList.add('form-group');
    div.innerHTML = `
      <select class="producto-select-new"></select>
      <input type="number" class="producto-cantidad-new" placeholder="Cantidad" min="1" />
      <input type="number" class="producto-subtotal-new" placeholder="Subtotal" readonly />
      <button type="button" class="eliminar-producto-btn">Eliminar</button>
    `;
    newProductsContainer.appendChild(div);

    // Cargar productos en el select
    const select = div.querySelector('.producto-select-new');
    productosDisponibles.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = `${p.nombre} ($${p.precio})`;
      select.appendChild(option);
    });

    const cantidadInput = div.querySelector('.producto-cantidad-new');
    const subtotalInput = div.querySelector('.producto-subtotal-new');

    // Calcular subtotal automáticamente
    const actualizarSubtotal = () => {
      const producto = productosDisponibles.find(p => p.id == select.value);
      const cantidad = parseInt(cantidadInput.value) || 0;
      subtotalInput.value = producto ? (producto.precio * cantidad).toFixed(2) : 0;
    };

    select.addEventListener('change', actualizarSubtotal);
    cantidadInput.addEventListener('input', actualizarSubtotal);

    // Eliminar producto
    div.querySelector('.eliminar-producto-btn').addEventListener('click', () => {
      div.remove();
    });
  });

  // 2️⃣ Botón guardar productos
  const btnSaveProducts = document.createElement('button');
  btnSaveProducts.type = 'button';
  btnSaveProducts.textContent = 'Guardar Productos';
  newProductsContainer.parentNode.insertBefore(btnSaveProducts, newProductsContainer.nextSibling);

  btnSaveProducts.addEventListener('click', async () => {
    const nuevosProductos = [];
    newProductsContainer.querySelectorAll('.form-group').forEach(div => {
      const productoId = parseInt(div.querySelector('.producto-select-new').value);
      const cantidad = parseInt(div.querySelector('.producto-cantidad-new').value);
      const subtotal = parseFloat(div.querySelector('.producto-subtotal-new').value);

      if (productoId && cantidad) {
        nuevosProductos.push({ pedidoId: pedido.id, productoId, cantidad, subtotal, precioUnitario: subtotal/cantidad });
      }
    });

    if (nuevosProductos.length === 0) return alert('No hay productos para guardar.');

    const success = await createPedidosItems({pedidoId: pedido.id , items: nuevosProductos}); 

    if (success) {
      newTotal += nuevosProductos.reduce((acc, p) => acc + p.subtotal, 0);
      document.getElementById('totalModal').value = newTotal;

      newProductsContainer.innerHTML = '';

      const pedidos = await callPedidos();
      renderPedidos(pedidos);
      const clienteId = parseInt(clienteSelect.value); 
      const estado = document.getElementById("estadoModal").value; 
      const fecha = document.getElementById("fechaModal").value; 
      const pedidoId = pedido.id; 
      if (pedidoId && clienteId && estado && fecha) { 
        const update = await updatePedido({ 
          pedidoId: pedidoId, 
          clienteId: clienteId, 
          fecha: fecha, 
          estado: estado, 
          total: newTotal 
        }); 
        if (update) { 
          const pedidos = await callPedidos(); 
          renderPedidos(pedidos); 
          /*modal.remove();*/ //Lo deje comentado porque no me decidia si es mejor cerrar el modal o dejarlo abierto para la comodidad del usuario } } } })
        }
      }  
    }
  });
  

  // ---------- Submit ----------
  const formUpdate = modal.querySelector("#form-update");
  formUpdate.addEventListener("submit", async (e) => {
    e.preventDefault();
    const clienteId = parseInt(clienteSelect.value);
    const estado = document.getElementById("estadoModal").value;
    const fecha = document.getElementById("fechaModal").value;
    const pedidoId = pedido.id;

    if(pedidoId && clienteId && estado && fecha) {
      // 1️⃣ Actualizar pedido
      const updatePedidoResult = await updatePedido({ pedidoId, clienteId, fecha, estado, total: newTotal });

      // 2️⃣ Agregar nuevos productos
      const nuevosItems = Array.from(newProductsContainer.querySelectorAll(".form-group")).map(el => {
        const productoId = parseInt(el.querySelector(".producto-select-new").value);
        const cantidad = parseInt(el.querySelector(".producto-cantidad-new").value) || 1;
        return { pedidoId, productoId, cantidad };
      });

      for (let item of nuevosItems) {
        await agregarPedidoItem(item); // función que envía al backend
      }

      if(updatePedidoResult) {
        const pedidos = await callPedidos();
        renderPedidos(pedidos);
        modal.remove();
      }
    }
  });
};



const callPedidos = () => {
  const pedidos = fetchPedidos()
  return pedidos
}

const eliminarPedido = async (pedidoId) => {
  const deleteP = deletePedido(pedidoId)
  const pedidos = await callPedidos()
  renderPedidos(pedidos)
}

const eliminarPedidoItem = async (pedidoItemId) => {
  const deleteP = await deletePedidoItem(pedidoItemId)
  const pedidos = await callPedidos()
  renderPedidos(pedidos)
  return deleteP
}


const pedidos = await callPedidos()
renderPedidos(pedidos)