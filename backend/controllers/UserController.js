import User from "../models/UserModel.js";
import { buatLog } from "./LogController.js"; 

// 1. Fungsi mengambil semua data user
export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['id_user', 'nama_lengkap', 'username', 'nis', 'kelas', 'level']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// 2. Fungsi membuat/registrasi user baru
export const createUser = async (req, res) => {
    const { nama_lengkap, username, nis, kelas, password, level } = req.body;
    try {
        await User.create({
            nama_lengkap: nama_lengkap,
            username: username,
            nis: nis || null,
            kelas: kelas || null,
            password: password,
            level: level || "siswa"
        });
        res.status(201).json({ msg: "User Berhasil Registrasi!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// 3. Fungsi Login Utama
export const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { username: req.body.username }
        });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        if (req.session) {
            req.session.userId = user.id_user;
            req.session.id_user = user.id_user;
        }

        // REKAM LOG AKTIVITAS LOGIN
        await buatLog(user.id_user, "Melakukan Login ke Sistem");

        res.status(200).json({ 
            id_user: user.id_user, 
            nama_lengkap: user.nama_lengkap, 
            username: user.username, 
            level: user.level,
            nis: user.nis || "-",   
            kelas: user.kelas || "-" 
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// 4. Fungsi Logout
export const logoutUser = async (req, res) => {
    try {
        const currentUserId = req.body.id_user || (req.session ? (req.session.userId || req.session.id_user) : null); 

        if (currentUserId) {
            await buatLog(currentUserId, "Melakukan Logout dari Sistem");
        }

        if (req.session) {
            req.session.destroy((err) => {
                if (err) return res.status(400).json({ msg: "Gagal memproses logout" });
                res.clearCookie("connect.sid");
                return res.status(200).json({ msg: "Anda telah logout berhasil" });
            });
        } else {
            res.status(200).json({ msg: "Anda telah logout berhasil" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// 5. Fungsi Mengupdate/Perbarui Data User (Siswa) 🌟 [BARU]
export const updateUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id_user: req.params.id }
        });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        const { nama_lengkap, username, nis, kelas, password, level } = req.body;
        
        // Jika password diisi baru di form edit, pakai yang baru. Jika kosong, pakai yang lama.
        let finalPassword = password ? password : user.password;

        await User.update({
            nama_lengkap: nama_lengkap,
            username: username,
            nis: nis || null,
            kelas: kelas || null,
            password: finalPassword,
            level: level || user.level
        }, {
            where: { id_user: user.id_user }
        });

        res.status(200).json({ msg: "Data Siswa Berhasil Diperbarui!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

// 6. Fungsi Menghapus Data User 🌟 [BARU]
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id_user: req.params.id }
        });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        await User.destroy({
            where: { id_user: user.id_user }
        });

        res.status(200).json({ msg: "Siswa Berhasil Dihapus!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};