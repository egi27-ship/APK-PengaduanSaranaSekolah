import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const AddSiswa = () => {
    const [nama, setNama] = useState("");
    const [nis, setNis] = useState("");
    const [username, setUsername] = useState("");
    const [kelas, setKelas] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const saveSiswa = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/users", {
                nama_lengkap: nama,
                nis: nis,
                username: username,
                password: password,
                confPassword: password, 
                kelas: kelas,
                level: "siswa"
            });
            navigate("/data-siswa");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    // Styling objek khusus untuk memastikan teks input & placeholder kontras dan jelas
    const inputStyle = {
        backgroundColor: '#ffffff', 
        color: '#1e293b',          // Warna teks ketikan menjadi Abu Gelap/Hitam yang tajam
        border: '1px solid #cbd5e1', 
        borderRadius: '6px'
    };

    return (
        <div className="container mt-4" style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
            <div className="mb-4">
                <h1 className="title is-4" style={{ color: '#0f172a', fontWeight: '700' }}>➕ Tambah Siswa Baru</h1>
            </div>

            {/* Kode CSS Tambahan langsung (Inline Tag Style) khusus mematikan warna pudar dari placeholder bawaan browser */}
            <style>
                {`
                    .input::placeholder {
                        color: #94a3b8 !important; /* Warna placeholder abu-abu netral yang kontras */
                        opacity: 1 !important;
                    }
                    .input:focus {
                        border-color: #3b82f6 !important;
                        box-shadow: 0 0 0 0.125em rgba(59, 130, 246, 0.25) !important;
                    }
                `}
            </style>

            <div className="box" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '30px', backgroundColor: '#ffffff', boxShadow: 'none' }}>
                <form onSubmit={saveSiswa} autoComplete="off">
                    {msg && (
                        <div className="notification is-danger is-light py-2 has-text-centered" style={{ borderRadius: '6px', fontWeight: '500' }}>
                            {msg}
                        </div>
                    )}
                    
                    <div className="field mb-4">
                        <label className="label" style={{ color: '#334155', fontWeight: '600' }}>Nama Lengkap</label>
                        <div className="control">
                            <input 
                                type="text" 
                                className="input" 
                                placeholder="Masukkan nama lengkap siswa..."
                                value={nama} 
                                onChange={(e)=>setNama(e.target.value)} 
                                style={inputStyle}
                                required 
                            />
                        </div>
                    </div>

                    <div className="columns mb-2">
                        <div className="column py-1">
                            <div className="field">
                                <label className="label" style={{ color: '#334155', fontWeight: '600' }}>NIS</label>
                                <div className="control">
                                    <input 
                                        type="text" 
                                        className="input" 
                                        placeholder="Contoh: 252001"
                                        value={nis} 
                                        onChange={(e)=>setNis(e.target.value)} 
                                        style={inputStyle}
                                        required 
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="column py-1">
                            <div className="field">
                                <label className="label" style={{ color: '#334155', fontWeight: '600' }}>Username Login</label>
                                <div className="control">
                                    <input 
                                        type="text" 
                                        className="input" 
                                        placeholder="Buat nama pengguna unik..."
                                        value={username} 
                                        onChange={(e)=>setUsername(e.target.value)} 
                                        style={inputStyle}
                                        required 
                                        autoComplete="new-password" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field mb-4">
                        <label className="label" style={{ color: '#334155', fontWeight: '600' }}>Kelas</label>
                        <div className="control">
                            <input 
                                type="text" 
                                className="input" 
                                placeholder="Contoh: XI PPLG"
                                value={kelas} 
                                onChange={(e)=>setKelas(e.target.value)} 
                                style={inputStyle}
                                required 
                            />
                        </div>
                    </div>

                    <div className="field mb-5">
                        <label className="label" style={{ color: '#334155', fontWeight: '600' }}>Password</label>
                        <div className="control">
                            <input 
                                type="password" 
                                className="input" 
                                placeholder="Tentukan sandi akun siswa..."
                                value={password} 
                                onChange={(e)=>setPassword(e.target.value)} 
                                style={inputStyle}
                                required 
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <div className="field is-grouped mt-5">
                        <div className="control">
                            <button type="submit" className="button is-link" style={{ fontWeight: '600', borderRadius: '6px', paddingLeft: '20px', paddingRight: '20px' }}>
                                💾 Simpan Siswa
                            </button>
                        </div>
                        <div className="control">
                            <Link to="/data-siswa" className="button is-light" style={{ fontWeight: '600', borderRadius: '6px', color: '#475569' }}>
                                Batal
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSiswa;