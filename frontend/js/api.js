const API_URL = "http://localhost:3000";

// Función para traer clientes desde el backend
export const fetchProductos = async () => {
  try {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error("Error al obtener clientes");

    const data = await response.json();

    return data.productos
  } catch (error) {
    console.error("Error:", error);
    clientesList.innerHTML = "<li>Error al cargar clientes</li>";
  }
}

export const createProduct = async ({nombre, precio, stock, estado}) => {
    try {
        const response = await fetch(`${API_URL}/productos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, precio, stock, estado })
        });

        const data = await response.json();

        if (response.ok) {
            return true;
        } else {
            alert("Error al crear producto: " + data.error);
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

export const deleteProduct = async ({productoId}) => {
    try {
        const response = await fetch(`${API_URL}/productos/${productoId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (response.ok) {
            return true;
        } else {
            alert("Error al eliminar producto: " + data.error);
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

export const updateProduct = async ({productoId, nombre, precio, stock, estado}) => {
    try {
        const response = await fetch(`${API_URL}/productos`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({productoId, nombre, precio, stock, estado })
        });

        const data = await response.json();

        if (response.ok) {
            return true;
        } else {
            alert("Error al crear producto: " + data.error);
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
    }
};