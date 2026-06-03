import Kategori from "../models/KategoriModel.js";
import Lokasi from "../models/LokasiModel.js"; 

// 1. Ambil Semua Kategori + Isinya
export const getKategori = async (req, res) => {
    try {
        const response = await Kategori.findAll({
            include: [{
                model: Lokasi,
                as: 'lokasis' 
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// 2. Untuk menghandle tambah kategori baru
export const createKategori = async (req, res) => {
    try {
        const { nama_kategori } = req.body;
        await Kategori.create({ 
            ket_kategori: nama_kategori // Menyesuaikan kolom DB kamu: ket_kategori
        });
        res.status(201).json({ msg: "Kategori Berhasil Ditambahkan" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

// 3. Menghandle form tombol hijau "Hubungkan Lokasi"
export const createLokasi = async (req, res) => {
    try {
        const { id_kategori, nama_lokasi } = req.body;
        await Lokasi.create({ 
            id_kategori: id_kategori, 
            nama_lokasi: nama_lokasi 
        });
        res.status(201).json({ msg: "Lokasi Berhasil Ditambahkan ke Kategori!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}