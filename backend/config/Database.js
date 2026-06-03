import { Sequelize } from "sequelize";

// Sesuaikan 'nama_db_kamu' dengan nama database yang kamu buat di phpMyAdmin
const db = new Sequelize('project_pengaduansekolah-egi', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

export default db;