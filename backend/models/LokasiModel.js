import { Sequelize } from "sequelize";
import db from "../config/Database.js"; // 🌟 Diperbaiki menjadi ../ agar jalurnya benar
import Kategori from "./KategoriModel.js";

const { DataTypes } = Sequelize;

const Lokasi = db.define('lokasi', {
    id_lokasi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_kategori: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nama_lokasi: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    freezeTableName: true
});

// Mengatur relasi agar Kategori memiliki banyak Lokasi
Kategori.hasMany(Lokasi, { foreignKey: 'id_kategori', as: 'lokasis' });
Lokasi.belongsTo(Kategori, { foreignKey: 'id_kategori' });

export default Lokasi;