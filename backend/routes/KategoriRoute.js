import express from "express";
import { 
    getKategori, 
    createKategori, 
    createLokasi
} from "../controllers/KategoriController.js";

const router = express.Router();

router.get('/kategori', getKategori);
router.post('/kategori', createKategori); // Menampung simpan kategori
router.post('/lokasi', createLokasi);     // Menampung hubungkan lokasi

export default router;