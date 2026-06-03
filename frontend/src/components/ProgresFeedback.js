import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ProgresFeedback = () => {
    const [progres, setProgres] = useState([]);
    const [loading, setLoading] = useState(true);
    const idUser = localStorage.getItem("id_user");

    const getProgres = useCallback(async () => {
        if (!idUser) return;
        try {
            const response = await axios.get(`http://localhost:5000/aspirasi/user/${idUser}`);
            setProgres(response.data);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    }, [idUser]);

    useEffect(() => {
        getProgres();
        const interval = setInterval(getProgres, 30000);
        return () => clearInterval(interval);
    }, [getProgres]);

    // Fungsi format waktu Indonesia
    const formatWaktu = (dateString) => {
        if (!dateString) return "-";
        const opsi = { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        return new Date(dateString).toLocaleDateString('id-ID', opsi).replace('.', ':');
    };

    const getPercentage = (status) => {
        switch (status?.toLowerCase().trim()) {
            case 'menunggu': 
                return { percent: 0, color: '#ffdd57', textColor: '#4a4a4a' }; 
            case 'diproses': 
                return { percent: 60, color: '#209cee', textColor: '#fff' }; 
            case 'selkit':
            case 'selesai': 
                return { percent: 100, color: '#48c78e', textColor: '#fff' };
            default: 
                return { percent: 0, color: '#b5b5b5', textColor: '#4a4a4a' };
        }
    };

    return (
        <div className="container mt-4">
            <div className="box" style={{ backgroundColor: '#ffffff', color: '#333333', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e1e8ed' }}>
                <h1 className="title is-4 has-text-link has-text-centered">Progress & Feedback Admin</h1>
                <hr style={{ backgroundColor: '#dbdbdb' }} />
                
                <div className="table-container">
                    <table className="table is-fullwidth" style={{ backgroundColor: 'transparent', color: '#333333' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                                <th className="has-text-dark" style={{ width: '15%' }}>Info Waktu</th>
                                <th className="has-text-dark">Judul & Deskripsi</th>
                                <th className="has-text-dark has-text-centered" style={{ width: '25%' }}>Progress & Status</th>
                                <th className="has-text-dark" style={{ width: '35%' }}>Balasan Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="has-text-centered py-5">
                                        <button className="button is-loading is-ghost">Memuat data...</button>
                                    </td>
                                </tr>
                            ) : progres.length > 0 ? (
                                progres.map((item) => {
                                    const prog = getPercentage(item.status);
                                    let balasanAdmin = item.feedback; 
                                    
                                    const dataBalasan = item.UmpanBalik || item.UmpanBaliks || item.umpan_baliks || item.umpan_balik;

                                    if (dataBalasan) {
                                        if (Array.isArray(dataBalasan) && dataBalasan.length > 0) {
                                            const umpanTerbaru = dataBalasan[dataBalasan.length - 1];
                                            balasanAdmin = umpanTerbaru.isi_balasan;
                                        } else if (dataBalasan.isi_balasan) {
                                            balasanAdmin = dataBalasan.isi_balasan;
                                        }
                                    }

                                    return (
                                        <tr key={item.id_aspirasi} style={{ borderBottom: '1px solid #dbdbdb' }}>
                                            {/* 🌟 KOLOM WAKTU: Menampilkan Tanggal Kirim DAN Tanggal Respon Admin */}
                                            <td className="is-vcentered">
                                                <div className="is-size-7">
                                                    <p className="has-text-grey">
                                                        📅 <strong>Kirim:</strong><br />
                                                        {formatWaktu(item.createdAt)}
                                                    </p>
                                                    {/* Jika statusnya bukan 'menunggu', berarti sudah direspon/diupdate admin */}
                                                    {item.status?.toLowerCase().trim() !== 'menunggu' && (
                                                        <p className="has-text-link mt-2">
                                                            🔄 <strong>Update:</strong><br />
                                                            {formatWaktu(item.updatedAt)}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            
                                            <td className="is-vcentered">
                                                <strong className="has-text-dark is-size-6">{item.judul}</strong>
                                                <p className="is-size-7 has-text-grey mt-1" style={{ maxWidth: '250px', wordBreak: 'break-word' }}>
                                                    {item.deskripsi}
                                                </p>
                                            </td>

                                            <td className="is-vcentered">
                                                <div style={{ backgroundColor: '#e1e8ed', borderRadius: '20px', height: '20px', overflow: 'hidden', position: 'relative' }}>
                                                    <div style={{ 
                                                        width: `${prog.percent}%`, 
                                                        backgroundColor: prog.color, 
                                                        height: '100%', 
                                                        transition: 'width 1s ease-in-out'
                                                    }} />
                                                    
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        pointerEvents: 'none'
                                                    }}>
                                                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: prog.percent === 0 ? '#4a4a4a' : '#ffffff' }}>
                                                            {prog.percent}%
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <p className="is-size-7 has-text-centered mt-1 is-uppercase has-text-weight-bold" style={{ color: prog.color === '#ffdd57' ? '#d9a700' : prog.color }}>
                                                    {item.status}
                                                </p>
                                            </td>

                                            <td className="is-vcentered">
                                                <div style={{ 
                                                    backgroundColor: '#f8fafc', 
                                                    padding: '12px', 
                                                    borderRadius: '8px', 
                                                    border: '1px solid #e1e8ed',
                                                    borderLeft: `4px solid ${prog.color === '#ffdd57' ? '#d9a700' : prog.color}`, 
                                                    minHeight: '50px'
                                                }}>
                                                    {balasanAdmin && balasanAdmin.trim() !== "" ? (
                                                        <p className="is-size-7 has-text-dark" style={{ whiteSpace: 'pre-line' }}>
                                                            {balasanAdmin}
                                                        </p>
                                                    ) : (
                                                        <p className="has-text-grey is-italic is-size-7">
                                                            Menunggu tanggapan sekolah...
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="has-text-centered has-text-grey py-5">
                                        <span>Belum ada data pengaduan yang dikirim.</span>
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

export default ProgresFeedback;