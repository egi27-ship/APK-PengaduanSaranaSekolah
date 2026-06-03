import express from "express";
import {
    getAllAspirasi,
    getAspirasiByUserId,
    createAspirasi,
    updateAspirasi,
    deleteAspirasi,
    koreksiAspirasi // Menggunakan fungsi pengeditan form utuh
} from "../controllers/AspirasiController.js";

const router = express.Router();

// Route untuk Admin & General
router.get('/aspirasi', getAllAspirasi);
router.patch('/aspirasi/:id', updateAspirasi); 

// Route untuk Siswa
router.get('/aspirasi/user/:id_user', getAspirasiByUserId); 
router.post('/aspirasi', createAspirasi);

// Route Aksi Siswa (Kunci Parameter ID Utama)
router.delete('/aspirasi/:id', deleteAspirasi);
router.put('/aspirasi/:id/koreksi', koreksiAspirasi);

export default router;