import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DataSiswa = () => {
    const [siswa, setSiswa] = useState([]);
    const [cariNama, setCariNama] = useState("");

    const getSiswa = async () => {
        try {
            const response = await axios.get("http://localhost:5000/users");
            const hanyaSiswa = response.data.filter(user => user.level === 'siswa');
            setSiswa(hanyaSiswa);
        } catch (error) {
            console.log("Gagal mengambil data siswa:", error);
        }
    };

    // Fungsi untuk menghapus data siswa
    const deleteSiswa = async (id) => {
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus data siswa ini?");
        if (confirmDelete) {
            try {
                // Pastikan endpoint backend Anda sesuai (menggunakan id_user atau id)
                await axios.delete(`http://localhost:5000/users/${id}`);
                // Refresh data setelah berhasil menghapus
                getSiswa();
            } catch (error) {
                console.log("Gagal menghapus data siswa:", error);
                alert("Gagal menghapus data siswa.");
            }
        }
    };

    useEffect(() => {
        getSiswa();
    }, []);

    // Filter Berdasarkan Pencarian Nama atau NIS
    const siswaTerfilter = siswa.filter((item) => {
        const nama = item.nama_lengkap?.toLowerCase() || "";
        const nis = item.nis?.toString() || "";
        const keyword = cariNama.toLowerCase();
        return nama.includes(keyword) || nis.includes(keyword);
    });

    return (
        <div className="container mt-4" style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
            
            {/* Kunci CSS lokal untuk mempertegas warna placeholder dan ketikan input */}
            <style>
                {`
                    .input::placeholder {
                        color: #64748b !important;
                        opacity: 1 !important;
                    }
                    .input {
                        color: #0f172a !important;
                    }
                `}
            </style>

            <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
                <h1 className="title is-4" style={{ color: '#0f172a', fontWeight: '700' }}>👤 Data Siswa Terdaftar</h1>
                <Link to="/users/add" className="button is-link" style={{ fontWeight: '600', borderRadius: '6px' }}>
                    ➕ Tambah Siswa Baru
                </Link>
            </div>

            {/* Input Filter Pencarian */}
            <div className="box mb-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: 'none' }}>
                <div className="field">
                    <label className="label" style={{ color: '#1e293b', fontWeight: '700' }}>🔍 Cari Siswa</label>
                    <div className="control">
                        <input 
                            type="text" 
                            className="input" 
                            placeholder="Ketik nama siswa atau NIS yang ingin dicari..." 
                            value={cariNama} 
                            onChange={(e) => setCariNama(e.target.value)}
                            style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                </div>
            </div>

            {/* Tabel Konten Utama */}
            <div className="box" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#ffffff', boxShadow: 'none' }}>
                <div style={{ overflowX: "auto" }}>
                    <table className="table is-fullwidth" style={{ backgroundColor: '#ffffff' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ color: '#0f172a', fontWeight: '800', fontSize: '15px', width: '120px' }}>ID NIS</th>
                                <th style={{ color: '#0f172a', fontWeight: '800', fontSize: '15px' }}>Nama Lengkap</th>
                                <th style={{ color: '#0f172a', fontWeight: '800', fontSize: '15px', width: '120px' }}>Kelas</th>
                                <th style={{ color: '#0f172a', fontWeight: '800', fontSize: '15px', width: '180px' }}>Username Login</th>
                                <th style={{ color: '#0f172a', fontWeight: '800', fontSize: '15px', width: '160px', textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {siswaTerfilter.length > 0 ? (
                                siswaTerfilter.map((item, index) => (
                                    <tr 
                                        key={item.id_user || index} 
                                        style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                                    >
                                        <td style={{ color: '#0f172a', fontWeight: '700' }}>{item.nis}</td>
                                        <td style={{ color: '#334155', fontWeight: '600' }}>{item.nama_lengkap}</td>
                                        <td style={{ color: '#475569', fontWeight: '500' }}>{item.kelas}</td>
                                        <td style={{ color: '#1a56db', fontWeight: '600' }}>{item.username}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div className="buttons is-centered">
                                                {/* Tombol Edit: Mengarah ke halaman form edit berdasarkan ID */}
                                                <Link 
                                                    to={`/users/edit/${item.id_user}`} 
                                                    className="button is-small is-info is-light"
                                                    style={{ fontWeight: '600', borderRadius: '4px' }}
                                                >
                                                    ✏️ Edit
                                                </Link>
                                                {/* Tombol Hapus: Memicu fungsi deleteSiswa */}
                                                <button 
                                                    onClick={() => deleteSiswa(item.id_user)} 
                                                    className="button is-small is-danger is-light"
                                                    style={{ fontWeight: '600', borderRadius: '4px' }}
                                                >
                                                    🗑️ Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="has-text-centered has-text-grey py-5" style={{ backgroundColor: '#ffffff', color: '#64748b' }}>
                                        Tidak ada data siswa terdaftar yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataSiswa;