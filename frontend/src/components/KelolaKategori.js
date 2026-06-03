import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const KelolaKategori = () => {
    const [kategoriList, setKategoriList] = useState([]);
    const [namaKategori, setNamaKategori] = useState("");
    
    // State untuk menghubungkan lokasi baru ke kategori tertentu
    const [selectedKategoriId, setSelectedKategoriId] = useState("");
    const [namaLokasi, setNamaLokasi] = useState("");

    // Ambil data kategori dari backend
    const getKategoriDanLokasi = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:5000/kategori", { withCredentials: true });
            console.log("=== DATA DARI BACKEND ===", response.data);
            setKategoriList(response.data);
        } catch (error) {
            console.error("Gagal mengambil data kategori:", error);
        }
    }, []);

    useEffect(() => {
        getKategoriDanLokasi();
    }, [getKategoriDanLokasi]);

    // Handler Kirim Kategori Baru
    const handleTambahKategori = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/kategori", {
                nama_kategori: namaKategori 
            }, { withCredentials: true });

            alert("Kategori baru berhasil ditambahkan!");
            setNamaKategori("");
            getKategoriDanLokasi(); 
        } catch (error) {
            alert(error.response?.data?.msg || "Gagal menambah kategori");
        }
    };

    // Handler Kirim Opsi Lokasi Baru
    const handleTambahLokasi = async (e) => {
        e.preventDefault();
        if (!selectedKategoriId) {
            alert("Silakan pilih kategori terlebih dahulu!");
            return;
        }
        try {
            await axios.post("http://localhost:5000/lokasi", {
                id_kategori: selectedKategoriId,
                nama_lokasi: namaLokasi
            }, { withCredentials: true });

            alert(`Lokasi berhasil ditambahkan ke kategori tersebut!`);
            setNamaLokasi("");
            getKategoriDanLokasi(); 
        } catch (error) {
            alert(error.response?.data?.msg || "Gagal menambah lokasi");
        }
    };

    // Style teks input saat user mengetik (Menggunakan warna tulisan gelap dan agak tebal)
    const inputStyle = { 
        backgroundColor: '#ffffff', 
        color: '#1e293b', 
        fontWeight: '500',
        border: '1px solid #cbd5e1', 
        borderRadius: '6px' 
    };

    return (
        <div className="container mt-4" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px' }}>
            {/* 🌟 PERBAIKAN SINTAKS CSS: Memaksa placeholder browser menjadi abu-abu gelap agar terlihat jelas */}
            <style>{`
                .input::placeholder {
                    color: #475569 !important;
                    opacity: 1 !important;
                }
                .input::-webkit-input-placeholder {
                    color: #475569 !important;
                    opacity: 1 !important;
                }
                .input::-moz-placeholder {
                    color: #475569 !important;
                    opacity: 1 !important;
                }
                select {
                    color: #1e293b !important;
                    font-weight: 500;
                }
            `}</style>

            <h1 className="title is-4" style={{ color: '#0f172a', fontWeight: '700', marginBottom: '20px' }}>🗂️ Kelola Kategori & Relasi Lokasi</h1>
            
            {/* KOTAK UTAMA YANG MENGGABUNGKAN INPUT DAN TABEL */}
            <div className="box" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: 'none', padding: '25px' }}>
                
                {/* BARIS SEJAJAR: Form Tambah Kategori & Form Tambah Lokasi */}
                <div className="columns mb-5" style={{ borderBottom: '2px dashed #e2e8f0', paddingBottom: '25px' }}>
                    
                    {/* Sisi Kiri: Tambah Kategori Baru */}
                    <div className="column is-5">
                        <h2 className="subtitle is-6" style={{ fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>➕ Tambah Kategori Baru</h2>
                        <form onSubmit={handleTambahKategori}>
                            <div className="field has-addons">
                                <div className="control is-expanded">
                                    <input 
                                        type="text" 
                                        className="input" 
                                        style={inputStyle}
                                        placeholder="Nama kategori baru..." 
                                        value={namaKategori}
                                        onChange={(e) => setNamaKategori(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="control">
                                    <button type="submit" className="button is-link" style={{ fontWeight: '600' }}>
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Pembatas Tengah Kosong */}
                    <div className="column is-1"></div>

                    {/* Sisi Kanan: Hubungkan Opsi Lokasi Baru */}
                    <div className="column is-6">
                        <h2 className="subtitle is-6" style={{ fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>📍 Daftarkan Opsi Lokasi Baru</h2>
                        <form onSubmit={handleTambahLokasi}>
                            <div className="field is-horizontal">
                                <div className="field-body">
                                    {/* Dropdown Pilih Kategori */}
                                    <div className="field">
                                        <div className="control">
                                            <div className="select is-fullwidth">
                                                <select 
                                                    style={inputStyle} 
                                                    value={selectedKategoriId} 
                                                    onChange={(e) => setSelectedKategoriId(e.target.value)}
                                                    required
                                                >
                                                    <option value="" style={{ color: '#475569' }}>-- Kategori Induk --</option>
                                                    {kategoriList.map((kat) => (
                                                        <option key={kat.id_kategori} value={kat.id_kategori}>
                                                            {kat.nama_kategori || kat.kategori || kat.ket_kategori}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Input Nama Lokasi */}
                                    <div className="field has-addons">
                                        <div className="control is-expanded">
                                            <input 
                                                type="text" 
                                                className="input" 
                                                style={inputStyle}
                                                placeholder="Nama lokasi spesifik..." 
                                                value={namaLokasi}
                                                onChange={(e) => setNamaLokasi(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="control">
                                            <button type="submit" className="button is-link" style={{ fontWeight: '600' }}>
                                                Hubungkan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>

                {/* BAGIAN BAWAH KOTAK: Tabel Monitoring Relasi Kategori & Lokasi */}
                <h2 className="subtitle is-5" style={{ fontWeight: '600', color: '#0f172a', marginBottom: '15px' }}>📋 Daftar Pemetaan Kategori & Opsi Lokasi</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table className="table is-fullwidth" style={{ backgroundColor: '#ffffff' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9' }}>
                                <th style={{ width: '60px', color: '#0f172a' }}>No</th>
                                <th style={{ width: '250px', color: '#0f172a' }}>Nama Kategori</th>
                                <th style={{ color: '#0f172a' }}>Pilihan Opsi Lokasi Tersedia (Muncul di Drop-down Siswa)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kategoriList.map((kat, index) => {
                                const opsiLokasi = kat.lokasis || kat.Lokasis || kat.lokasi || kat.sub_lokasi || [];
                                return (
                                    <tr key={kat.id_kategori || index} style={{ backgroundColor: '#ffffff' }}>
                                        <td style={{ color: '#334155', paddingTop: '12px' }}>{index + 1}</td>
                                        <td style={{ fontWeight: '600', color: '#0f172a', paddingTop: '12px' }}>
                                            {kat.nama_kategori || kat.kategori || kat.ket_kategori}
                                        </td>
                                        <td>
                                            <div className="tags">
                                                {opsiLokasi && opsiLokasi.length > 0 ? (
                                                    opsiLokasi.map((lok, i) => {
                                                        const idAsli = lok.id_lokasi;
                                                        const namaAsli = lok.nama_lokasi || lok.lokasi || lok.nama;
                                                        
                                                        return (
                                                            /* 🌟 PERBAIKAN: Tombol hapus bawaan bulma (<button className="delete">) sudah dihapus secara permanen */
                                                            <span 
                                                                key={idAsli || i} 
                                                                className="tag is-info is-light" 
                                                                style={{ fontWeight: '500', display: 'inline-flex', alignItems: 'center', padding: '6px 12px' }}
                                                            >
                                                                📍 {namaAsli}
                                                            </span>
                                                        );
                                                    })
                                                ) : (
                                                    <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                                        Belum ada relasi data lokasi yang ditarik dari API rute ini.
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default KelolaKategori;