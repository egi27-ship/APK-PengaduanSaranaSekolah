import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import db from "./config/Database.js";

// Import Model
import User from "./models/UserModel.js";
import Aspirasi from "./models/AspirasiModel.js";
import Kategori from "./models/KategoriModel.js";
import Lokasi from "./models/LokasiModel.js"; // Pastikan model lokasi diimport
import UmpanBalik from "./models/UmpanBalikModel.js"; 
import LogAktivitas from "./models/LogModel.js"; 

// Import Route
import UserRoute from "./routes/UserRoute.js";
import AspirasiRoute from "./routes/AspirasiRoute.js";
import KategoriRoute from "./routes/KategoriRoute.js";
import UmpanBalikRoute from "./routes/UmpanBalikRoute.js"; 
import LogRoute from "./routes/LogRoute.js"; 

const app = express();

(async () => {
    try {
        await db.authenticate();
        console.log('Database Connected...');
        
        // Jalankan sinkronisasi tabel
        await db.sync(); 
        console.log('Database Loaded Successfully and Tables Synced!');

        // 🌟 DI SINI TEMPATNYA TEPAT SETELAH DB.SYNC():
        const cekLokasi = await Lokasi.count();
        if (cekLokasi <= 1) { // Jika tabel kosong atau baru terisi 1 data uji coba
            console.log('Sinkronisasi data lokasi awal ke dashboard Admin...');
            
            // Bersihkan dulu data uji coba jika ada
            await Lokasi.destroy({ where: {}, truncate: true });

            await Lokasi.bulkCreate([
                // Kategori Kebersihan (id_kategori: 1)
                { id_kategori: 1, nama_lokasi: "Kantin" },
                { id_kategori: 1, nama_lokasi: "Toilet" },
                { id_kategori: 1, nama_lokasi: "Halaman Depan" },
                { id_kategori: 1, nama_lokasi: "Koridor Kelas" },

                // Kategori Keamanan (id_kategori: 2)
                { id_kategori: 2, nama_lokasi: "Gerbang Utama" },
                { id_kategori: 2, nama_lokasi: "Parkir Siswa" },
                { id_kategori: 2, nama_lokasi: "Parkir Guru" },
                { id_kategori: 2, nama_lokasi: "Pos Satpam" },

                // Kategori Aula (id_kategori: 3)
                { id_kategori: 3, nama_lokasi: "Panggung Aula" },
                { id_kategori: 3, nama_lokasi: "Gudang Aula" },
                { id_kategori: 3, nama_lokasi: "Area Tengah" },
            ]);
            
            console.log('Semua data lokasi bawaan berhasil disinkronkan ke Admin!');
        }

    } catch (error) {
        console.error('Connection error:', error);
    }
})();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

// Routes
app.use(UserRoute);
app.use(KategoriRoute); 
app.use(AspirasiRoute);
app.use(UmpanBalikRoute); 
app.use(LogRoute); 

app.listen(5000, () => console.log('Server up and running...'));