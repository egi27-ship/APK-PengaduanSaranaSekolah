import React, { useState } from 'react';
import axios from 'axios';

const LoginUser = () => {
    // Identity bisa diisi NIS atau Username sesuai input user
    const [identity, setIdentity] = useState(''); 
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const Auth = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { 
                username: identity, // Mengirim identitas ke field 'username' di backend
                password: password 
            });

            // DEBUG: Cek di console browser untuk memastikan data yang masuk
            console.log("Response dari Server:", response.data);
            
            // --- PENYIMPANAN DATA KE LOCALSTORAGE ---
            localStorage.setItem("id_user", response.data.id_user);
            localStorage.setItem("nis", response.data.nis);
            localStorage.setItem("nama_lengkap", response.data.nama_lengkap);
            localStorage.setItem("kelas", response.data.kelas);
            localStorage.setItem("level", response.data.level);
            localStorage.setItem("username", response.data.username);
            
            // --- LOGIKA REDIRECT BERDASARKAN LEVEL ---
            if (response.data.level === 'admin') {
                window.location.href = "/admin/dashboard";
            } else {
                window.location.href = "/dashboard"; 
            }
            
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg); 
            } else {
                setMsg("Gagal koneksi ke Server. Pastikan Backend sudah nyala.");
            }
        }
    };

    return (
        /* 🌟 PERUBAHAN: Background dasar diubah jadi abu-abu terang lembut (#f1f5f9) serasi dengan halaman dashboard */
        <section className="hero is-fullheight" style={{ backgroundColor: '#f1f5f9' }}>
            
            {/* Trik CSS Injector: Memastikan placeholder input terlihat jelas & seimbang */}
            <style>
                {`
                    .input-login-custom::placeholder {
                        color: #94a3b8 !important;
                        opacity: 1 !important;
                    }
                    .input-login-custom {
                        color: #0f172a !important;
                        height: 44px !important;
                    }
                `}
            </style>

            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4">
                            
                            {/* 🌟 PERUBAHAN: Box form diubah jadi warna putih bersih dengan garis aksen biru tua di bagian atas */}
                            <form onSubmit={Auth} className="box" style={{ 
                                backgroundColor: '#ffffff', 
                                borderTop: '5px solid #485fc7', 
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
                                padding: '30px'
                            }}>
                                
                                <h1 className="title is-4 has-text-centered" style={{ color: '#0f172a', fontWeight: '800', marginBottom: '5px' }}>
                                    LOGIN SISTEM
                                </h1>
                                <p className="subtitle is-6 has-text-centered" style={{ color: '#64748b', fontWeight: '500', marginBottom: '25px' }}>
                                    Pengaduan & Aspirasi Sekolah
                                </p>
                                
                                {/* Notifikasi Error */}
                                {msg && (
                                    <div className="notification is-danger is-light" style={{ borderRadius: '6px', fontSize: '0.9rem' }}>
                                        {msg}
                                    </div>
                                )}
                                
                                {/* Input Username / NIS */}
                                <div className="field mb-4">
                                    <label className="label" style={{ color: '#334155', fontWeight: '600', fontSize: '0.95rem' }}>Username atau NIS</label>
                                    <div className="control">
                                        <input 
                                            className="input input-login-custom" 
                                            type="text" 
                                            placeholder="Masukkan Username / NIS"
                                            value={identity} 
                                            onChange={(e) => setIdentity(e.target.value)} 
                                            style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Input Password */}
                                <div className="field mb-5">
                                    <label className="label" style={{ color: '#334155', fontWeight: '600', fontSize: '0.95rem' }}>Password</label>
                                    <div className="control">
                                        <input 
                                            className="input input-login-custom" 
                                            type="password" 
                                            placeholder="******"
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* Tombol Login */}
                                {/* 🌟 PERUBAHAN: Menggunakan class 'is-link' (biru) bawaan Bulma agar selaras dengan tombol utama aplikasi */}
                                <button type="submit" className="button is-link is-fullwidth mt-5" style={{ height: '44px', fontWeight: '700', borderRadius: '6px', fontSize: '1rem' }}>
                                    MASUK KE SISTEM
                                </button>

                                <div className="has-text-centered mt-4">
                                    <p className="is-size-7" style={{ color: '#64748b', fontWeight: '500' }}>
                                        Belum punya akun? <a href="/register" className="has-text-link" style={{ fontWeight: '600' }}>Daftar Sekarang</a>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginUser;