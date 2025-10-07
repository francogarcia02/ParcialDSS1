import { DataTypes } from "sequelize";

export const PedidosModel = (sequelize) => {
  return sequelize.define("Pedidos", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    estado: { type: DataTypes.STRING, allowNull: false },
    total: { type: DataTypes.FLOAT, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
  });
};

