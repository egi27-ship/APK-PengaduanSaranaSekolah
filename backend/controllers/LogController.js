import LogAktivitas from "../models/LogModel.js";
import User from "../models/UserModel.js";

// Helper untuk mencatat log aktivitas sistem secara aman
export const buatLog = async (id_user, aktivitas) => {
    try {
        // PENGAMAN: Jika id_user kosong/undefined, ubah jadi null agar database tidak menolak constraint
        const validIdUser = id_user || null;

        await LogAktivitas.create({
            id_user: validIdUser,
            aktivitas: aktivitas
            // Kolom 'waktu' otomatis terisi DataTypes.NOW dari konfigurasi model
        });
        
        console.log(`[LOG SYSTEM] Berhasil mencatat aktivitas: "${aktivitas}" untuk ID User: ${validIdUser}`);
    } catch (error) {
        console.error("Gagal mencatat log aktivitas ke database:", error.message);
    }
};

// API Endpoint untuk mengambil semua log (Dipakai Frontend Admin)
export const getLogs = async (req, res) => {
    try {
        const response = await LogAktivitas.findAll({
            include: [{
                model: User,
                attributes: ['nama_lengkap', 'level', 'nis']
            }],
            order: [['waktu', 'DESC']] 
        });
        res.status(200).json(response);
    } catch (error) {
        console.error("Error pada getLogs backend:", error.message);
        res.status(500).json({ msg: error.message });
    }
};