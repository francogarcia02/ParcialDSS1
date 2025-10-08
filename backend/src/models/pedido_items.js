import { DataTypes } from "sequelize";

export const Pedido_ItemsModel = (sequelize) => {
  return sequelize.define("Pedido_Items", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    precioUnitario: { type: DataTypes.FLOAT, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    subtotal: { type: DataTypes.FLOAT, allowNull: false },
  });
};