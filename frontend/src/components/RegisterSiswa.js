import React, { useState } from 'react';
import axios from 'axios';

const RegisterSiswa = () => {
    const [namaLengkap, setNamaLengkap] = useState('');
    const [nis, setNis] = useState('');
    const [username, setUsername] = useState('');
    const [kelas, setKelas] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [success, setSuccess] = useState('');

    const HandleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/users', {
                nama_lengkap: namaLengkap,
                nis: nis,
                username: username,
                kelas: kelas,
                password: password,
                level: 'siswa' 
            });

            setSuccess("Akun siswa berhasil dibuat! Mengalihkan ke login...");
            setMsg('');
            
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);

        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg || "Gagal melakukan pendaftaran.");
            } else {
                setMsg("Tidak dapat terhubung ke server backend.");
            }
        }
    };

    return (
        <section className="hero is-fullheight" style={{ backgroundColor: '#f1f5f9' }}>
            
            <style>
                {`
                    .input-register-custom {
                        background-color: #ffffff !important;
                        color: #0f172a !important;
                        border: 1px solid #cbd5e1 !important;
                        border-radius: 6px !important;
                        height: 42px !important;
                    }
                    .input-register-custom::placeholder {
                        color: #94a3b8 !important;
                        opacity: 1 !important;
                    }
                    .input-register-custom:focus {
                        border-color: #485fc7 !important;
                        box-shadow: 0 0 0 0.125em rgba(72, 95, 199, 0.25) !important;
                    }
                `}
            </style>

            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-5">
                            
                            {/* 🌟 Ditambahkan autoComplete="off" pada form dasar */}
                            <form onSubmit={HandleRegister} autoComplete="off" className="box" style={{ 
                                backgroundColor: '#ffffff', 
                                borderTop: '5px solid #485fc7', 
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                                padding: '30px'
                            }}>
                                
                                <h1 className="title is-4 has-text-centered" style={{ color: '#0f172a', fontWeight: '800', marginBottom: '5px' }}>
                                    DAFTAR AKUN SISWA
                                </h1>
                                <p className="subtitle is-6 has-text-centered" style={{ color: '#64748b', fontWeight: '500', marginBottom: '25px' }}>
                                    Registrasi Mandiri Akses Siswa
                                </p>

                                {msg && <div className="notification is-danger is-light py-2 px-3 mb-3" style={{ fontSize: '0.9rem', borderRadius: '6px' }}>{msg}</div>}
                                {success && <div className="notification is-success is-light py-2 px-3 mb-3" style={{ fontSize: '0.9rem', borderRadius: '6px' }}>{success}</div>}

                                {/* Nama Lengkap */}
                                <div className="field mb-3">
                                    <label className="label" style={{ color: '#334155', fontWeight: '600', fontSize: '0.9rem' }}>Nama Lengkap</label>
                                    <div className="control">
                                        <input 
                                            className="input input-register-custom" 
                                            type="text" 
                                            placeholder="Masukkan nama lengkap"
                                            value={namaLengkap} 
                                            onChange={(e) => setNamaLengkap(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="columns mb-0">
                                    {/* NIS */}
                                    <div className="column field mb-3">
                                        <label className="label" style={{ color: '#334155', fontWeight: '600', fontSize: '0.9rem' }}>NIS</label>
                                        <div className="control">
                                            <input 
                                                className="input input-register-custom" 
                                                type="text" 
                                                placeholder="Masukkan NIS"
                                                value={nis} 
                                                onChange={(e) => setNis(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Username */}
                                    <div className="column field mb-3">
                                        <label className="label" style={{ color: '#334155', fontWeight: '600', fontSize: '0.9rem' }}>Username Login</label>
                                        <div className="control">
                                            {/* 🌟 Ditambahkan autoComplete="new-password" agar tidak diisi otomatis oleh browser */}
                                            <input 
                                                className="input input-register-custom" 
                                                type="text" 
                                                placeholder="Buat username"
                                                autoComplete="new-password"
                                                value={username} 
                                                onChange={(e) => setUsername(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Kelas */}
                                <div className="field mb-3">
                                    <label className="label" style={{ color: '#334155', fontWeight: '600', fontSize: '0.9rem' }}>Kelas</label>
                                    <div className="control">
                                        <input 
                                            className="input input-register-custom" 
                                            type="text" 
                                            placeholder="Masukkan kelas"
                                            value={kelas} 
                                            onChange={(e) => setKelas(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div> {/* 🌟 PERBAIKAN: Teks typo 'end' yang merusak tampilan sudah dihapus */}

                                {/* Password */}
                                <div className="field mb-5">
                                    <label className="label" style={{ color: '#334155', fontWeight: '600', fontSize: '0.9rem' }}>Password</label>
                                    <div className="control">
                                        {/* 🌟 Ditambahkan autoComplete="new-password" agar sandi lama admin tidak nyangkut di sini */}
                                        <input 
                                            className="input input-register-custom" 
                                            type="password" 
                                            placeholder="Buat password"
                                            autoComplete="new-password"
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="button is-link is-fullwidth" style={{ height: '44px', fontWeight: '700', borderRadius: '6px' }}>
                                    DAFTAR SEKARANG
                                </button>

                                <div className="has-text-centered mt-4">
                                    <p className="is-size-7" style={{ color: '#64748b' }}>
                                        Sudah punya akun? <a href="/" className="has-text-link" style={{ fontWeight: '600' }}>Kembali ke Login</a>
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

export default RegisterSiswa;