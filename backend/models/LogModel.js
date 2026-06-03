import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const LogAktivitas = db.define('log_aktivitas', {
    id_log: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    aktivitas: {
        type: DataTypes.TEXT, // 🌟 Ubah jadi TEXT agar muat menampung pesan detail aktivitas yang panjang
        allowNull: false
    },
    waktu: {
        type: DataTypes.DATE, // 🌟 Gunakan kolom waktu sesuai skemamu
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true,
    timestamps: false // 🌟 Matikan timestamps bawaan jika menggunakan kolom 'waktu' manual
});

User.hasMany(LogAktivitas, { foreignKey: 'id_user' });
LogAktivitas.belongsTo(User, { foreignKey: 'id_user' });

export default LogAktivitas;