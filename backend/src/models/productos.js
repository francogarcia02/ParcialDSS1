import { DataTypes } from "sequelize";

export const ProductosModel = (sequelize) => {
  return sequelize.define("Productos", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    precio: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    estado: { type: DataTypes.STRING, allowNull: false },
  });
};