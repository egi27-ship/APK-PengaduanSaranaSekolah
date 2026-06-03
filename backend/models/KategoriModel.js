import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Kategori = db.define('kategori', {
    id_kategori: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ket_kategori: DataTypes.STRING
},{
    freezeTableName: true
});

export default Kategori; // PASTIKAN ADA BARIS INI