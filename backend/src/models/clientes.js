import { DataTypes } from "sequelize";

export const ClientesModel = (sequelize) => {
  return sequelize.define("Clientes", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
  });
};