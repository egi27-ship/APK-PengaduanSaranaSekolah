import React, { useState, useEffect } from "react";
import axios from "axios";

const LogAktivitas = () => {
    const [logs, setLogs] = useState([]);

    const getLogs = async () => {
        try {
            const response = await axios.get("http://localhost:5000/logs");
            setLogs(response.data);
        } catch (error) {
            console.error("Gagal mengambil data log:", error);
        }
    };

    useEffect(() => {
        getLogs();
    }, []);

    // Format waktu lokal Indonesia
    const formatWaktuIndo = (waktuRaw) => {
        if (!waktuRaw) return "-";
        return new Date(waktuRaw).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }) + " WIB";
    };

    return (
        <div className="container mt-4" style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
            
            <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
                <h1 className="title is-4" style={{ color: '#0f172a', fontWeight: '700' }}>🕒 Log Aktivitas Sistem</h1>
                <button onClick={getLogs} className="button is-light" style={{ fontWeight: '600' }}>
                    🔄 Refresh Log
                </button>
            </div>

            {/* Tabel Log */}
            <div className="box" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#ffffff', boxShadow: 'none' }}>
                <div style={{ overflowX: "auto" }}>
                    <table className="table is-fullwidth" style={{ backgroundColor: '#ffffff', color: '#1e293b', minWidth: '850px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ color: '#0f172a', fontWeight: '700', width: '60px' }}>No</th>
                                <th style={{ color: '#0f172a', fontWeight: '700', width: '240px', whiteSpace: 'nowrap' }}>⏰ Waktu Kejadian</th>
                                <th style={{ color: '#0f172a', fontWeight: '700', width: '220px', whiteSpace: 'nowrap' }}>👤 Pengguna</th>
                                <th style={{ color: '#0f172a', fontWeight: '700', width: '120px', whiteSpace: 'nowrap' }}>🛡️ Role</th>
                                <th style={{ color: '#0f172a', fontWeight: '700' }}>⚡ Deskripsi Aktivitas Sistem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? (
                                logs.map((log, index) => (
                                    <tr key={log.id_log || index} style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ color: '#334155', fontWeight: '500', verticalAlign: 'middle' }}>{index + 1}</td>
                                        
                                        <td style={{ color: '#334155', fontSize: '0.9rem', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                                            {formatWaktuIndo(log.waktu)}
                                        </td>
                                        
                                        <td style={{ color: '#0f172a', fontWeight: '600', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                                            {log.user?.nama_lengkap || "Sistem"} {log.user?.nis ? `(${log.user.nis})` : ''}
                                        </td>
                                        
                                        <td style={{ verticalAlign: 'middle' }}>
                                            <span className={`tag is-small ${log.user?.level === 'admin' ? 'is-danger is-light' : 'is-info is-light'}`}>
                                                {log.user?.level || "system"}
                                            </span>
                                        </td>
                                        
                                        <td style={{ color: '#334155', fontWeight: '500', wordBreak: 'break-word', verticalAlign: 'middle' }}>
                                            {log.aktivitas || "-"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="has-text-centered has-text-grey py-4">
                                        Tidak ada catatan aktivitas yang ditemukan.
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

export default LogAktivitas;