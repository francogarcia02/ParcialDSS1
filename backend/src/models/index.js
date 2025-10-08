import { ClientesModel } from "./clientes.js";
import { PedidosModel } from "./pedidos.js";
import { sequelize } from "../config/db.js";
import { ProductosModel } from "./productos.js";
import { Pedido_ItemsModel } from "./pedido_items.js";

// Inicializamos los modelos
export const Clientes = ClientesModel(sequelize);
export const Pedidos = PedidosModel(sequelize);
export const Productos = ProductosModel(sequelize)
export const Pedido_Items = Pedido_ItemsModel(sequelize)

// Definimos la relación FK
Pedidos.belongsTo(Clientes, { foreignKey: "clienteId", onDelete: "CASCADE" });
Clientes.hasMany(Pedidos, { foreignKey: "clienteId" });

Pedido_Items.belongsTo(Pedidos, { foreignKey: "pedidoId", onDelete: "CASCADE" });
Pedidos.hasMany(Pedido_Items, { foreignKey: "pedidoId" });

// Relación Producto → Pedido_Items (1:N)
Pedido_Items.belongsTo(Productos, { foreignKey: "productoId", onDelete: "CASCADE" });
Productos.hasMany(Pedido_Items, { foreignKey: "productoId" });

