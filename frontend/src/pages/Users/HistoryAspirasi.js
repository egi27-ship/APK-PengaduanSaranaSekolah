import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 

const HistoryAspirasi = () => {
    const [aspirasi, setAspirasi] = useState([]);
    const idUser = localStorage.getItem("id_user");

    const getHistory = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/aspirasi/user/${idUser}`);
            setAspirasi(response.data);
        } catch (error) {
            console.error("Gagal mengambil data history:", error);
        }
    }, [idUser]);

    useEffect(() => {
        if (idUser) {
            getHistory();
        }
    }, [idUser, getHistory]);

    // ==========================================
    // FUNGSI A: Menghapus / Membatalkan Pengaduan
    // ==========================================
    const handleDelete = (idAspirasi) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Pengaduan yang dibatalkan/dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', 
            cancelButtonColor: '#64748b', 
            confirmButtonText: 'Ya, Batalkan!',
            cancelButtonText: 'Kembali'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/aspirasi/${idAspirasi}`);
                    
                    Swal.fire({
                        title: 'Dibatalkan!',
                        text: 'Pengaduan Anda berhasil dihapus dari sistem.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    
                    getHistory(); 
                } catch (error) {
                    console.error("Gagal menghapus:", error);
                    Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus data.', 'error');
                }
            }
        });
    };

    // ==========================================
    // FUNGSI B: Membuka Form Koreksi (Data Terisi Otomatis)
    // ==========================================
    const handleEditForm = (item) => {
        Swal.fire({
            title: 'Koreksi Data Pengaduan',
            html: `
                <div style="text-align: left;">
                    <label style="font-weight:600; font-size:14px;">Judul Aduan</label>
                    <input id="swal-judul" class="swal2-input" style="margin: 5px 0 15px 0; width: 93%;" value="${item.judul}">
                    
                    <label style="font-weight:600; font-size:14px;">Lokasi Kejadian</label>
                    <input id="swal-lokasi" class="swal2-input" style="margin: 5px 0 15px 0; width: 93%;" value="${item.lokasi}">
                    
                    <label style="font-weight:600; font-size:14px;">Deskripsi Lengkap</label>
                    <textarea id="swal-deskripsi" class="swal2-textarea" style="margin: 5px 0 5px 0; width: 93%; height: 120px;">${item.deskripsi}</textarea>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Simpan Perubahan',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const judul = document.getElementById('swal-judul').value.trim();
                const lokasi = document.getElementById('swal-lokasi').value.trim();
                const deskripsi = document.getElementById('swal-deskripsi').value.trim();
                
                if (!judul || !lokasi || !deskripsi) {
                    Swal.showValidationMessage('Semua kolom input formulir wajib diisi!');
                    return false;
                }
                return { judul, lokasi, deskripsi };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Jalankan request PUT menuju endpoint koreksi backend
                    await axios.put(`http://localhost:5000/aspirasi/${item.id_aspirasi}/koreksi`, {
                        judul: result.value.judul,
                        lokasi: result.value.lokasi,
                        deskripsi: result.value.deskripsi,
                        id_user: idUser
                    });

                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Data pengaduan Anda berhasil diperbarui.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    getHistory(); 
                } catch (error) {
                    console.error("Gagal memperbarui data:", error);
                    Swal.fire('Gagal!', 'Terjadi gangguan sistem saat mengoreksi data.', 'error');
                }
            }
        });
    };

    return (
        <div className="container mt-5">
            <div className="box" style={{ backgroundColor: '#ffffff', color: '#333333', borderRadius: '10px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <h1 className="title is-4 has-text-link has-text-centered">Riwayat Aspirasi Saya</h1>
                <hr style={{ backgroundColor: '#dbdbdb' }} />
                
                <div className="table-container">
                    <table className="table is-fullwidth is-hoverable" style={{ backgroundColor: '#ffffff', color: '#333333' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #dbdbdb' }}>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>No</th>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>Judul</th>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>Kategori</th>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>Lokasi</th>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>Deskripsi</th>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>Bukti Foto</th>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>Status</th>
                                <th className="has-text-centered" style={{ color: '#333333', fontWeight: '700' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aspirasi.length > 0 ? (
                                aspirasi.map((item, index) => {
                                    const statusCurrent = (item.status || "menunggu").toLowerCase().trim();
                                    
                                    // Aturan Akses: Hanya bisa dikoreksi/batal jika status masih menunggu atau baru
                                    const bisaAksesAksi = statusCurrent === 'menunggu' || statusCurrent === 'baru';

                                    return (
                                        <tr key={item.id_aspirasi || index} style={{ backgroundColor: '#ffffff', color: '#333333', borderBottom: '1px solid #edf2f7' }}>
                                            <td className="has-text-centered is-vcentered" style={{ color: '#333333' }}>{index + 1}</td>
                                            <td className="has-text-centered is-vcentered has-text-weight-bold" style={{ color: '#1a202c' }}>{item.judul}</td>
                                            <td className="has-text-centered is-vcentered" style={{ color: '#4a5568' }}>{item.kategori?.ket_kategori || "-"}</td>
                                            <td className="has-text-centered is-vcentered" style={{ color: '#4a5568' }}>{item.lokasi}</td>
                                            <td className="is-vcentered" style={{ maxWidth: '250px', wordWrap: 'break-word', color: '#4a5568' }}>
                                                {item.deskripsi}
                                            </td>
                                            <td className="has-text-centered is-vcentered">
                                                {item.gambar ? (
                                                    <figure className="image is-64x64 is-inline-block">
                                                        <img 
                                                            src={`http://localhost:5000/images/${item.gambar}`} 
                                                            alt="bukti" 
                                                            style={{ borderRadius: '5px', objectFit: 'cover', border: '1px solid #dbdbdb' }}
                                                        />
                                                    </figure>
                                                ) : (
                                                    <span className="has-text-grey-light is-size-7">Tidak ada foto</span>
                                                )}
                                            </td>
                                            <td className="has-text-centered is-vcentered">
                                                <span className={`tag is-medium is-bold ${
                                                    statusCurrent === 'menunggu' || statusCurrent === 'baru' ? 'is-warning has-text-dark' : 
                                                    statusCurrent === 'diproses' ? 'is-info has-text-white' : 
                                                    statusCurrent === 'selesai' || statusCurrent === 'selkit' ? 'is-success has-text-white' : 
                                                    'is-light has-text-dark'
                                                }`}>
                                                    {statusCurrent.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="has-text-centered is-vcentered">
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                                                    {bisaAksesAksi ? (
                                                        <>
                                                            {/* TOMBOL KOREKSI FORM */}
                                                            <button 
                                                                onClick={() => handleEditForm(item)} 
                                                                className="button is-info is-small is-light"
                                                                style={{ fontWeight: '600', borderRadius: '4px', width: '105px' }}
                                                            >
                                                                ✏️ Koreksi
                                                            </button>

                                                            {/* TOMBOL BATALKAN ADUAN */}
                                                            <button 
                                                                onClick={() => handleDelete(item.id_aspirasi)} 
                                                                className="button is-danger is-small is-light"
                                                                style={{ fontWeight: '600', borderRadius: '4px', width: '105px' }}
                                                            >
                                                                🗑️ Batalkan
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="has-text-grey-light is-italic is-size-7">🔒 Dikunci</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="has-text-centered has-text-grey py-5" style={{ backgroundColor: '#ffffff' }}>
                                        Belum ada aspirasi.
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

export default HistoryAspirasi;