import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [allData, setAllData] = useState([]);
    const [stats, setStats] = useState({ total: 0, menunggu: 0, diproses: 0, selesai: 0 });
    const idUser = localStorage.getItem("id_user");
    const nama = localStorage.getItem("nama_lengkap") || "User";
    const level = localStorage.getItem("level");

    useEffect(() => {
        const getStats = async () => {
            try {
                const url = level === "admin" 
                    ? "http://localhost:5000/aspirasi" 
                    : `http://localhost:5000/aspirasi/user/${idUser}`;
                
                const response = await axios.get(url);
                const data = response.data;
                setAllData(data);
                
                const total = data.length;
                const menunggu = data.filter(item => item.status?.toLowerCase() === 'menunggu').length;
                const diproses = data.filter(item => item.status?.toLowerCase() === 'diproses').length;
                const selesai = data.filter(item => item.status?.toLowerCase() === 'selesai').length;

                setStats({ total, menunggu, diproses, selesai });
            } catch (error) {
                console.error("Gagal mengambil data statistik:", error);
            }
        };
        if (idUser) getStats();
    }, [idUser, level]);

    const getKategoriString = (item) => {
        if (!item) return "-";
        if (item.kategori && typeof item.kategori === 'object') {
            return item.kategori.ket_kategori || "-";
        }
        if (item.nama_kategori && typeof item.nama_kategori === 'object') {
            return item.nama_kategori.ket_kategori || "-";
        }
        return item.ket_kategori || item.nama_kategori || item.kategori || "-";
    };

    const chartData = {
        labels: ['Menunggu', 'Diproses', 'Selesai'],
        datasets: [
            {
                data: [stats.menunggu, stats.diproses, stats.selesai],
                backgroundColor: ['#b5d6fd', '#3273dc', '#24408e'], /* Tema Biru Segar Gradasi */
                borderColor: ['#ffffff', '#ffffff', '#ffffff'],
                borderWidth: 2,
            },
        ],
    };

    return (
        /* Wrapper div dengan inline style background terang agar warna hitam di luar container hilang */
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px 10px' }}>
            <div className="container mt-2">
                <h1 className="title is-3 has-text-dark">
                    Selamat Datang, {nama} {level === 'admin' ? '(Admin)' : ''} 👋
                </h1>
                <p className="subtitle is-6 has-text-grey mb-6">
                    📄 {level === 'admin' 
                        ? "Berikut adalah ringkasan seluruh pengaduan siswa." 
                        : "Berikut adalah ringkasan pengaduan kamu."}
                </p>

                <div className="columns is-multiline">
                    <div className="column is-4">
                        <div className="box" style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <p className="has-text-grey is-size-7 has-text-weight-bold">📊 TOTAL PENGADUAN</p>
                            <h2 className="title is-2 has-text-link">{stats.total}</h2>
                            <hr style={{ backgroundColor: '#eeeeee', height: '1px' }} />
                            <div className="is-flex is-justify-content-space-between mb-2">
                                <span className="has-text-dark">⏳ Menunggu</span>
                                <span className="tag is-warning is-light has-text-weight-bold">{stats.menunggu}</span>
                            </div>
                            <div className="is-flex is-justify-content-space-between mb-2">
                                <span className="has-text-dark">⚙️ Diproses</span>
                                <span className="tag is-link is-light has-text-weight-bold">{stats.diproses}</span>
                            </div>
                            <div className="is-flex is-justify-content-space-between">
                                <span className="has-text-dark">✅ Selesai</span>
                                <span className="tag is-success is-light has-text-weight-bold">{stats.selesai}</span>
                            </div>
                        </div>
                    </div>

                    <div className="column is-8">
                        <div className="box" style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', height: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <h3 className="has-text-dark has-text-weight-bold mb-4 has-text-centered">📈 Visualisasi Status</h3>
                            <div style={{ maxHeight: '250px', display: 'flex', justifyContent: 'center' }}>
                                {stats.total > 0 ? (
                                    <Doughnut 
                                        data={chartData} 
                                        options={{ 
                                            maintainAspectRatio: false, 
                                            plugins: { legend: { labels: { color: '#333333', font: { weight: 'bold' } } } } 
                                        }} 
                                    />
                                ) : (
                                    <p className="has-text-grey is-italic mt-6">Belum ada data visual.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AREA TABEL LAPORAN TERBARU */}
                <div className="box mt-5" style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <h3 className="title is-5 has-text-dark mb-4">
                        📌 {level === 'admin' ? "Laporan Terbaru Masuk" : "Pengaduan Terbaru Kamu"}
                    </h3>
                    <div className="table-container">
                        <table className="table is-fullwidth" style={{ backgroundColor: 'transparent', color: '#333333' }}>
                            <thead>
                                <tr className="has-background-link-light" style={{ borderBottom: '2px solid #3273dc' }}>
                                    <th className="has-text-link-dark">📅 Tanggal</th>
                                    {level === 'admin' && <th className="has-text-link-dark">👤 Pengirim</th>}
                                    <th className="has-text-link-dark">🗂️ Kategori</th>
                                    <th className="has-text-link-dark">✏️ Judul Laporan</th>
                                    <th className="has-text-link-dark has-text-centered">⚙️ Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allData.length > 0 ? (
                                    // 🌟 REVISI: Diurutkan secara kronologis (Terbaru -> Terlama) terlebih dahulu sebelum mengambil 5 data teratas
                                    [...allData]
                                        .sort((a, b) => {
                                            const dateA = new Date(a.tanggal_pengajuan || a.createdAt);
                                            const dateB = new Date(b.tanggal_pengajuan || b.createdAt);
                                            return dateB - dateA;
                                        })
                                        .slice(0, 5)
                                        .map((item, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #eeeeee' }}>
                                                <td className="is-vcentered is-size-7 has-text-grey-dark">
                                                    {item.tanggal_pengajuan || item.createdAt ? new Date(item.tanggal_pengajuan || item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                                                </td>
                                                {level === 'admin' && (
                                                    <td className="is-vcentered has-text-dark has-text-weight-medium">
                                                        {item.user?.nama_lengkap || item.User?.nama_lengkap || "Siswa"}
                                                    </td>
                                                )}
                                                <td className="is-vcentered">
                                                    <span className="tag is-link is-light has-text-weight-bold">
                                                        {getKategoriString(item)}
                                                    </span>
                                                </td>
                                                <td className="is-vcentered has-text-weight-semibold has-text-dark">{item.judul || "-"}</td>
                                                <td className="has-text-centered is-vcentered">
                                                    <span className={`tag is-small ${
                                                        item.status?.toLowerCase() === 'menunggu' ? 'is-warning' : 
                                                        item.status?.toLowerCase() === 'diproses' ? 'is-link' : 'is-success'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan={level === 'admin' ? 5 : 4} className="has-text-centered has-text-grey py-4">
                                            Belum ada data laporan masuk.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;