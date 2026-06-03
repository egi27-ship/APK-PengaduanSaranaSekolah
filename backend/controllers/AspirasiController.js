import Aspirasi from "../models/AspirasiModel.js";
import Kategori from "../models/KategoriModel.js";
import User from "../models/UserModel.js";
import UmpanBalik from "../models/UmpanBalikModel.js"; 
import path from "path";
import fs from "fs"; 
import { buatLog } from "./LogController.js"; 

// 1. Ambil Semua Data Aspirasi (Untuk Tampilan Admin + Riwayat Balasan Admin)
export const getAllAspirasi = async (req, res) => {
    try {
        const response = await Aspirasi.findAll({
            include: [
                {
                    model: Kategori,
                    as: 'kategori',
                    attributes: ['ket_kategori']
                },
                {
                    model: User, 
                    as: 'user', 
                    attributes: ['nama_lengkap', 'kelas', 'nis']
                },
                {
                    model: UmpanBalik,
                    attributes: ['id_umpan_balik', 'isi_balasan', 'progres', 'tanggal_balasan']
                }
            ],
            order: [['updatedAt', 'DESC']]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// 2. Ambil Data Berdasarkan User ID (Untuk History & Progress Siswa)
export const getAspirasiByUserId = async (req, res) => {
    try {
        const parameterId = req.params.id || req.params.id_user; 

        const response = await Aspirasi.findAll({
            where: { id_siswa: parameterId },
            include: [
                {
                    model: Kategori,
                    as: 'kategori',
                    attributes: ['ket_kategori']
                },
                {
                    model: UmpanBalik,
                    attributes: ['id_umpan_balik', 'isi_balasan', 'progres', 'tanggal_balasan']
                }
            ],
            order: [['updatedAt', 'DESC']] 
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// 3. Tambah Aspirasi Baru (Siswa)
export const createAspirasi = async (req, res) => {
    let fileName = "";
    if (req.files && req.files.gambar) { 
        const file = req.files.gambar;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;

        const allowedType = ['.png', '.jpg', '.jpeg'];
        if (!allowedType.includes(ext.toLowerCase())) 
            return res.status(422).json({ msg: "Format gambar tidak valid! Gunakan png, jpg, atau jpeg." });

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }

    const { judul, id_kategori, lokasi, deskripsi, id_siswa, kode_aspirasi } = req.body;

    try {
        await Aspirasi.create({
            kode_aspirasi,
            id_siswa,
            id_kategori,
            judul,
            lokasi,
            deskripsi,
            gambar: fileName,
            status: "menunggu",
            tanggal_pengajuan: new Date()
        });

        await buatLog(
            id_siswa, 
            "Kirim Pengaduan", 
            `Membuat pengaduan baru [${kode_aspirasi}] dengan judul: "${judul}"`
        );

        res.status(201).json({ msg: "Aspirasi Berhasil Dibuat" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// 4. Update Status & Feedback (Oleh Admin)
export const updateAspirasi = async (req, res) => {
    try {
        const { status, feedback } = req.body;
        const userIdAktif = req.userId || req.session?.userId || req.body.id_user; 

        await Aspirasi.update({
            status: status,
            feedback: feedback
        }, {
            where: {
                id_aspirasi: req.params.id
            }
        });

        if (userIdAktif) {
            await buatLog(
                userIdAktif, 
                "Update Aspirasi", 
                `Mengubah status Aspirasi ID ${req.params.id} menjadi [${status}]`
            );
        }

        res.status(200).json({ msg: "Aspirasi Berhasil Diupdate" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// 5. Hapus / Batalkan Aspirasi (Siswa)
export const deleteAspirasi = async (req, res) => {
    try {
        const aspirasi = await Aspirasi.findOne({
            where: { id_aspirasi: req.params.id }
        });

        if (!aspirasi) return res.status(404).json({ msg: "Data aspirasi tidak ditemukan" });

        if (aspirasi.gambar) {
            const filepath = `./public/images/${aspirasi.gambar}`;
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }

        await Aspirasi.destroy({
            where: { id_aspirasi: req.params.id }
        });

        await buatLog(
            aspirasi.id_siswa,
            "Batalkan Pengaduan",
            `Menghapus/membatalkan pengaduan dengan judul: "${aspirasi.judul}"`
        );

        res.status(200).json({ msg: "Aspirasi Berhasil Dibatalkan/Dihapus" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// 6. Koreksi / Edit Isi Pengaduan Secara Keseluruhan (Siswa)
export const koreksiAspirasi = async (req, res) => {
    try {
        const { judul, lokasi, deskripsi, id_user } = req.body;
        const id_aspirasi = req.params.id;

        const aspirasi = await Aspirasi.findOne({
            where: { id_aspirasi: id_aspirasi }
        });
        
        if (!aspirasi) {
            return res.status(404).json({ msg: "Data pengaduan tidak ditemukan" });
        }

        const statusCurrent = (aspirasi.status || "menunggu").toLowerCase().trim();
        if (statusCurrent !== 'menunggu' && statusCurrent !== 'baru') {
            return res.status(400).json({ msg: "Aduan sudah diproses atau selesai, tidak dapat dikoreksi!" });
        }

        // Jalankan pembaruan data kolom yang diizinkan untuk dikoreksi
        await Aspirasi.update({
            judul: judul,
            lokasi: lokasi,
            deskripsi: deskripsi
        }, {
            where: { id_aspirasi: id_aspirasi }
        });

        await buatLog(
            id_user,
            "Koreksi Aspirasi",
            `Melakukan koreksi perubahan pada aduan ID ${id_aspirasi}`
        );

        res.status(200).json({ msg: "Pengaduan berhasil dikoreksi!" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}