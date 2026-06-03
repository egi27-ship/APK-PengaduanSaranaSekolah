import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar"; 
import KelolaPengaduan from "./components/KelolaPengaduan";
import DataSiswa from "./components/DataSiswa";
import LoginUser from "./pages/Users/LoginUser";
import RegisterSiswa from "./components/RegisterSiswa"; 
import Dashboard from "./pages/Users/Dashboard";
import HistoryAspirasi from "./pages/Users/HistoryAspirasi";
import AddAspirasi from "./pages/Users/AddAspirasi";
import ProgresFeedback from "./components/ProgresFeedback";
import LogAktivitas from "./components/LogAktivitas"; 
import AddSiswa from "./pages/Users/AddSiswa"; 
import KelolaKategori from "./components/KelolaKategori"; 

// 🌟 REVISI TAMBAHAN: Import Komponen FormEditSiswa yang baru dibuat
import FormEditSiswa from "./components/FormEditSiswa"; 

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Jika sedang di halaman login ("/") ATAU di halaman daftar ("/register"), sembunyikan Sidebar
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  return (
    <div style={{ display: "flex", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%" }}>
      {!isAuthPage && <Sidebar />}
      <div style={{ 
        flex: 1, 
        marginLeft: isAuthPage ? "0" : "250px", 
        padding: "20px",
        backgroundColor: "#f8fafc", 
        minHeight: "100vh"
      }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginUser />} />
          {/* ROUTE REGISTER MANDIRI UNTUK SISWA */}
          <Route path="/register" element={<RegisterSiswa />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          
          <Route path="/history" element={<HistoryAspirasi />} />
          <Route path="/add" element={<AddAspirasi />} />
          <Route path="/feedback" element={<ProgresFeedback />} />
          
          <Route path="/kelola-pengaduan" element={<KelolaPengaduan />} />
          <Route path="/data-siswa" element={<DataSiswa />} />
          
          {/* Route Halaman Kelola Kategori Admin */}
          <Route path="/kelola-kategori" element={<KelolaKategori />} />
          
          <Route path="/logs" element={<LogAktivitas />} />
          
          <Route path="/users/add" element={<AddSiswa />} />

          {/* 🌟 REVISI TAMBAHAN: Daftarkan Route Halaman Edit Siswa di Sini */}
          <Route path="/users/edit/:id" element={<FormEditSiswa />} />
          
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;