import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Aspirasi from "./AspirasiModel.js"; // Pastikan sesuaikan dengan nama file model aspirasimu

const { DataTypes } = Sequelize;

const UmpanBalik = db.define('umpan_balik', {
    id_umpan_balik: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_aspirasi: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isi_balasan: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tanggal_balasan: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    progres: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true // Karena di phpMyAdmin ada created_at dan updated_at
});

// Relasi tabel
Aspirasi.hasMany(UmpanBalik, { foreignKey: 'id_aspirasi' });
UmpanBalik.belongsTo(Aspirasi, { foreignKey: 'id_aspirasi' });

Users.hasMany(UmpanBalik, { foreignKey: 'id_user' });
UmpanBalik.belongsTo(Users, { foreignKey: 'id_user' });

export default UmpanBalik;