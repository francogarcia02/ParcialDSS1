import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../../data/db.sqlite");

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false,
});