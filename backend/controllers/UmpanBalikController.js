import UmpanBalik from "../models/UmpanBalikModel.js"; 
import Aspirasi from "../models/AspirasiModel.js"; 
import { buatLog } from "./LogController.js"; 

// 1. Mengambil semua data umpan balik dari database
export const getUmpanBalik = async (req, res) => {
    try {
        const response = await UmpanBalik.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// 2. 🌟 BARU & AMAN: Membuat Tanggapan/Umpan Balik Baru (Mencegah Log Nama Tertukar)
export const createUmpanBalik = async (req, res) => {
    // Destructuring data dari body request, termasuk id_user kiriman frontend
    const { id_aspirasi, isi_balasan, progres, id_user } = req.body;
    
    try {
        // Ambil ID pengirim secara adaptif: utamakan kiriman body frontend, cadangkan ke session jika ada
        const idAdminYangLogin = id_user || (req.session ? (req.session.userId || req.session.id_user) : null); 

        // Validasi ketat jika ID kosong agar tidak memicu crash 'undefined' pada server
        if (!idAdminYangLogin) {
            return res.status(400).json({ msg: "Gagal memproses: Identitas User/Admin tidak terdeteksi!" });
        }

        // Langkah A: Insert data balasan ke dalam tabel umpan_balik
        await UmpanBalik.create({
            id_aspirasi: id_aspirasi,
            id_user: idAdminYangLogin, // Disimpan sebagai ID admin yang menanggapi
            isi_balasan: isi_balasan,
            progres: progres,
            tanggal_balasan: new Date()
        });

        // Langkah B: Sinkronisasi update status/progres di tabel aspirasi (laporan utama)
        await Aspirasi.update({ status: progres }, {
            where: {
                id_aspirasi: id_aspirasi
            }
        });

        // Langkah C: 🌟 REKAM LOG AKTIVITAS (Menggunakan ID Admin yang terverifikasi)
        // Log ini akan otomatis menampilkan nama Admin asli di dashboard log aktivitas sistem
        await buatLog(idAdminYangLogin, "Berikan Tanggapan Laporan");

        res.status(201).json({ msg: "Umpan balik berhasil dikirim dan tercatat di log!" });
    } catch (error) {
        console.error("Gagal mengirim umpan balik pada backend:", error.message);
        res.status(500).json({ msg: error.message });
    }
};