import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; 

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 🌟 Mengambil rute URL aktif di browser saat ini
  
  // Ambil data user secara aman dari localStorage
  const userSession = JSON.parse(localStorage.getItem("user")) || {};
  
  const nama = userSession.nama_lengkap || localStorage.getItem("nama_lengkap") || "User";
  const kelas = userSession.kelas || localStorage.getItem("kelas") || "-";
  const level = userSession.level || localStorage.getItem("level");

  // Fungsi logout
  const logout = async () => {
    try {
      const idUserAktif = userSession.id_user || localStorage.getItem("id_user"); 

      if (idUserAktif) {
        await axios.post("http://localhost:5000/logout", {
          id_user: idUserAktif
        });
      }
    } catch (error) {
      console.error("Gagal mengirimkan log logout ke backend:", error);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  // 🌟 REVISI LOGIKA STYLE: Mendeteksi apakah rute URL saat ini adalah dashboard
  // Menangani variasi URL seperti '/dashboard', '/dashboard-admin', '/admin/dashboard', dll.
  const isDashboardActive = 
    location.pathname === "/dashboard" || 
    location.pathname.includes("dashboard");

  const getMenuStyle = (isActive) => ({
    backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
    color: "#ffffff",
    fontWeight: isActive ? "700" : "500",
    borderRadius: "6px",
    padding: "10px 15px",
    display: "block",
    transition: "all 0.2s ease",
    opacity: isActive ? "1" : "0.8"
  });

  return (
    <div style={{
      width: "250px", 
      height: "100vh", 
      background: "linear-gradient(180deg, #2b6cb0 0%, #1a365d 100%)", 
      color: "#ffffff", 
      position: "fixed", 
      padding: "30px 20px", 
      boxShadow: "4px 0 10px rgba(0,0,0,0.05)",
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "space-between",
      zIndex: 1000
    }}>
      <div>
        <h2 className="title is-4 mb-6 ml-2" style={{ letterSpacing: '1px', color: '#ffffff', fontWeight: 'bold' }}>
          🏫 Pengaduan
        </h2>
        
        <aside className="menu">
          <p className="menu-label ml-2" style={{ fontSize: '0.75rem', marginBottom: '1.2rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600' }}>
            {level === 'admin' ? '💼 ADMIN PANEL' : '🗂️ MAIN MENU'}
          </p>
          <ul className="menu-list" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            
            {/* 🌟 TOMBOL DASHBOARD DINAMIS */}
            <li>
              <Link 
                to={level === 'admin' ? location.pathname : "/dashboard"} 
                style={getMenuStyle(isDashboardActive)}
              >
                📊 Dashboard
              </Link>
            </li>
            
            {/* MENU KHUSUS SISWA */}
            {level === 'siswa' && (
              <>
                <li>
                  <Link to="/add" style={getMenuStyle(location.pathname === "/add")}>
                    ✏️ Kirim Pengaduan
                  </Link>
                </li>
                <li>
                  <Link to="/history" style={getMenuStyle(location.pathname === "/history")}>
                    ⏳ Riwayat Saya
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" style={getMenuStyle(location.pathname === "/feedback")}>
                    ✅ Progres & Feedback
                  </Link>
                </li>
              </>
            )}

            {/* MENU KHUSUS ADMIN */}
            {level === 'admin' && (
              <>
                <li>
                  <Link to="/kelola-pengaduan" style={getMenuStyle(location.pathname === "/kelola-pengaduan")}>
                    📌 Kelola Pengaduan
                  </Link>
                </li>
                <li>
                  <Link to="/kelola-kategori" style={getMenuStyle(location.pathname === "/kelola-kategori")}>
                    🗂️ Kelola Kategori
                  </Link>
                </li>
                <li>
                  <Link to="/data-siswa" style={getMenuStyle(location.pathname === "/data-siswa")}>
                    👤 Data Siswa
                  </Link>
                </li>
                <li>
                  <Link to="/logs" style={getMenuStyle(location.pathname === "/logs")}>
                    🕒 Log Aktivitas
                  </Link>
                </li>
              </>
            )}
          </ul>
        </aside>
      </div>

      <div style={{ paddingBottom: '10px' }}>
        <hr style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", height: '1px', margin: '15px 0' }} />
        <div className="ml-2">
          <p className="is-size-7" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Logged in as:</p>
          <p className="is-size-6 has-text-weight-bold mb-4" style={{ color: '#ffffff' }}>
            👤 {nama} {level === 'siswa' ? `(${kelas})` : '(Admin)'}
          </p>
          <button 
            onClick={logout} 
            className="button is-fullwidth is-small" 
            style={{ 
              fontWeight: 'bold', 
              backgroundColor: 'rgba(255, 255, 255, 0.15)', 
              color: '#ffffff', 
              border: '1px solid rgba(255, 255, 255, 0.25)',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;