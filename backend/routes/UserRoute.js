import express from "express";
import { 
    getUsers, 
    createUser, 
    loginUser,
    logoutUser,
    updateUser, // 🌟 Diimport dari controller
    deleteUser  // 🌟 Diimport dari controller
} from "../controllers/UserController.js";

const router = express.Router();

// Rute bawaan sebelumnya
router.get('/users', getUsers);
router.post('/users', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); 

// Rute Baru untuk Update dan Delete 🌟
router.patch('/users/:id', updateUser);  // Menangani aksi edit/update (FormEditSiswa)
router.delete('/users/:id', deleteUser); // Menangani aksi hapus (Tombol Hapus di tabel)

export default router;