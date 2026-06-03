import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";
import Kategori from "./KategoriModel.js";

const { DataTypes } = Sequelize;

const Aspirasi = db.define('aspirasi', {
    id_aspirasi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    kode_aspirasi: DataTypes.STRING,
    id_siswa: DataTypes.INTEGER,
    id_kategori: DataTypes.INTEGER,
    judul: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    lokasi: DataTypes.STRING,
    gambar: DataTypes.STRING, // 🌟 Pastikan nama properti sesuai kolom database kamu
    status: DataTypes.STRING,
    feedback: DataTypes.TEXT,
    tanggal_pengajuan: DataTypes.DATE
}, {
    freezeTableName: true,
    underscored: true, // 🌟 KUNCI UTAMA: Memberitahu Sequelize untuk memakai created_at & updated_at
    timestamps: true  // Tetap true karena kolomnya ada di database kamu
});

// Relasi
User.hasMany(Aspirasi, { foreignKey: 'id_siswa' });
Aspirasi.belongsTo(User, { foreignKey: 'id_siswa', as: 'user' });

Kategori.hasMany(Aspirasi, { foreignKey: 'id_kategori' });
Aspirasi.belongsTo(Kategori, { foreignKey: 'id_kategori', as: 'kategori' });

export default Aspirasi;