import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

const FormEditSiswa = () => {
    const [namaLengkap, setNamaLengkap] = useState("");
    const [username, setUsername] = useState("");
    const [nis, setNis] = useState("");
    const [kelas, setKelas] = useState("");
    const [password, setPassword] = useState(""); 
    const [msg, setMsg] = useState("");
    
    // State untuk kontrol visibility password
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();
    const { id } = useParams(); 

    useEffect(() => {
        const getUserById = async () => {
            try {
                const response = await axios.get("http://localhost:5000/users");
                const user = response.data.find(u => u.id_user === parseInt(id));
                if (user) {
                    setNamaLengkap(user.nama_lengkap || "");
                    setUsername(user.username || "");
                    setNis(user.nis || "");
                    setKelas(user.kelas || "");
                }
            } catch (error) {
                if (error.response) setMsg(error.response.data.msg);
            }
        };
        getUserById();
    }, [id]);

    const updateSiswa = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/users/${id}`, {
                nama_lengkap: namaLengkap,
                username: username,
                nis: nis,
                kelas: kelas,
                password: password 
            });
            
            alert("Data siswa berhasil diperbarui!");
            navigate("/data-siswa"); 
        } catch (error) {
            if (error.response) setMsg(error.response.data.msg);
        }
    };

    // Style kolom agar tetap putih bersih dan teks hitam
    const inputStyle = {
        borderRadius: "6px",
        backgroundColor: "#ffffff",
        color: "#1e293b",
        borderColor: "#cbd5e1"
    };

    return (
        <div className="container mt-4">
            <div className="columns is-centered">
                <div className="column is-10-desktop is-12-tablet">
                    <div className="box p-5" style={{ 
                        borderRadius: "10px", 
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
                    }}>
                        
                        <div className="is-flex is-align-items-center mb-5">
                            <span style={{ fontSize: "1.8rem", marginRight: "10px" }}>✏️</span>
                            <h1 className="title is-4 mb-0" style={{ color: '#1e3a8a', fontWeight: "700" }}>
                                Edit Data Akun Siswa
                            </h1>
                        </div>
                        
                        <hr className="my-4" style={{ backgroundColor: "#e2e8f0", height: "1px" }} />
                        
                        {msg && <div className="notification is-danger is-light p-3 mb-4">{msg}</div>}

                        <form onSubmit={updateSiswa}>
                            {/* Baris Berdampingan 1: Nama & NIS */}
                            <div className="columns">
                                <div className="column is-6">
                                    <div className="field">
                                        <label className="label" style={{ color: "#334155" }}>Nama Lengkap</label>
                                        <div className="control">
                                            <input 
                                                type="text" 
                                                className="input" 
                                                style={inputStyle}
                                                value={namaLengkap} 
                                                onChange={(e) => setNamaLengkap(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="column is-6">
                                    <div className="field">
                                        <label className="label" style={{ color: "#334155" }}>ID NIS</label>
                                        <div className="control">
                                            <input 
                                                type="text" 
                                                className="input" 
                                                style={inputStyle}
                                                value={nis} 
                                                onChange={(e) => setNis(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Baris Berdampingan 2: Kelas & Username */}
                            <div className="columns">
                                <div className="column is-6">
                                    <div className="field">
                                        <label className="label" style={{ color: "#334155" }}>Kelas</label>
                                        <div className="control">
                                            <input 
                                                type="text" 
                                                className="input" 
                                                style={inputStyle}
                                                value={kelas} 
                                                onChange={(e) => setKelas(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="column is-6">
                                    <div className="field">
                                        <label className="label" style={{ color: "#334155" }}>Username Login</label>
                                        <div className="control">
                                            <input 
                                                type="text" 
                                                className="input" 
                                                style={inputStyle}
                                                value={username} 
                                                onChange={(e) => setUsername(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Baris Tunggal: Password dengan Icon Mata Standar Web */}
                            <div className="field">
                                <label className="label" style={{ color: "#334155" }}>
                                    Password Baru <span className="has-text-grey is-size-7 font-weight-normal">(Kosongkan jika tidak ingin diganti)</span>
                                </label>
                                <div className="control has-icons-right">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        className="input" 
                                        style={{...inputStyle, paddingRight: "2.5rem"}}
                                        placeholder="******" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                    />
                                    {/* 🌟 Ikon SVG Interaktif Interaktif (Bukan Emoji) */}
                                    <span 
                                        className="icon is-right" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ 
                                            pointerEvents: "auto", 
                                            cursor: "pointer",
                                            color: "#64748b",
                                            userSelect: "none",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        {showPassword ? (
                                            // 🌟 Ikon Mata Terbuka (Show)
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        ) : (
                                            // 🌟 Ikon Mata Dicoret / Tertutup (Hide)
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: "20px", height: "20px" }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <hr className="my-5" style={{ backgroundColor: "#e2e8f0", height: "1px" }} />

                            {/* Tombol Aksi */}
                            <div className="field is-grouped is-grouped-right">
                                <div className="control">
                                    <Link to="/data-siswa" className="button is-light" style={{ borderRadius: "6px", fontWeight: "600" }}>
                                        Batal
                                    </Link>
                                </div>
                                <div className="control">
                                    <button type="submit" className="button is-link" style={{ borderRadius: "6px", fontWeight: "600", backgroundColor: "#2563eb" }}>
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormEditSiswa;