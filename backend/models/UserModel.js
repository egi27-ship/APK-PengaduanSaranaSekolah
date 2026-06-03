import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define('users', {
    // 1. Tambahkan id_user sebagai Primary Key
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // 2. Gunakan nama_lengkap (bukan nama)
    nama_lengkap: {
        type: DataTypes.STRING
    },
    // 3. Tambahkan username (untuk login)
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    // 4. NIS tetap ada tapi bukan lagi Primary Key
    nis: {
        type: DataTypes.STRING
    },
    kelas: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    // 5. Tambahkan level untuk membedakan Admin dan Siswa
    level: {
        type: DataTypes.ENUM('admin', 'siswa'),
        defaultValue: 'siswa'
    }
}, {
    freezeTableName: true 
});

export default User;

// Hapus atau beri komentar bagian sync() ini jika database sudah rapi
// (async () => {
//     await db.sync();
// })();