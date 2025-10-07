import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { sequelize } from "./config/db.js";

// Imports de rutas
import clientesRoutes from './routes/clientes.routes.js'
import pedidosRoutes from './routes/pedidos.routes.js'
import productosRoutes from './routes/productos.routes.js'
import pedidosItemsRoutes from './routes/pedidosItems.routes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uso de rutas
app.use("/api", routes);

app.use(clientesRoutes)

app.use(pedidosRoutes)

app.use(productosRoutes)

app.use(pedidosItemsRoutes)

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión con la base de datos establecida correctamente.");

    await sequelize.sync(); // crea tablas si no existen
    console.log("🗄️ Modelos sincronizados con la base de datos.");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
  }
};

startServer();