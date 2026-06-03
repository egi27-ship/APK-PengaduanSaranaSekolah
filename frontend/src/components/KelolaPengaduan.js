import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const KelolaPengaduan = () => {
    const [pengaduan, setPengaduan] = useState([]);
    const [filterKategori, setFilterKategori] = useState("Semua");
    const [filterTanggal, setFilterTanggal] = useState("");
    const [cariSiswa, setCariSiswa] = useState(""); 

    // State untuk kontrol Pop-Up Modal Umpan Balik
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAspirasiId, setSelectedAspirasiId] = useState(null);
    const [isiBalasan, setIsiBalasan] = useState("");
    const [progresStatus, setProgresStatus] = useState("menunggu");
    
    // State menampung object laporan yang sedang aktif diklik
    const [selectedAspirasiData, setSelectedAspirasiData] = useState(null);

    // Mengunci scroll halaman belakang & handle tombol ESC untuk menutup modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setIsModalOpen(false);
        };

        if (isModalOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isModalOpen]);

    // Mengambil data pengaduan dari backend
    const getPengaduan = useCallback(async () => {
        try {
            // Ditambahkan withCredentials jika endpoint ini butuh verifikasi session/cookie
            const response = await axios.get("http://localhost:5000/aspirasi", { withCredentials: true });
            setPengaduan(response.data);
        } catch (error) {
            console.error("Gagal mengambil data pengaduan:", error);
        }
    }, []);

    useEffect(() => {
        getPengaduan();
    }, [getPengaduan]);

    // Mengunci object item pengaduan utuh ke dalam state saat tombol diklik
    const handleOpenModal = (item) => {
        setSelectedAspirasiId(item.id_aspirasi);
        setSelectedAspirasiData(item); 
        setIsiBalasan("");
        
        // Helper mengambil list balasan secara aman
        const listBalasan = item.UmpanBaliks || item.umpan_baliks || item.umpan_balik || [];
        const statusTerakhir = listBalasan.length > 0 
            ? listBalasan[listBalasan.length - 1].progres 
            : (item.status || "menunggu");
        
        setProgresStatus(statusTerakhir.toLowerCase().trim()); 
        setIsModalOpen(true);
    };

    // Mengirim data form umpan balik ke backend API
    const handleSubmitUmpanBalik = async (e) => {
        e.preventDefault();
        try {
            const userLocalStorage = JSON.parse(localStorage.getItem("user")) || {};
            const idAdminAktif = localStorage.getItem("id_user") || userLocalStorage.id_user || userLocalStorage.id; 

            if (!idAdminAktif) {
                alert("Sesi Admin tidak terdeteksi, silakan login ulang!");
                return;
            }

            await axios.post("http://localhost:5000/umpanbalik", {
                id_aspirasi: selectedAspirasiId,
                id_user: idAdminAktif, 
                isi_balasan: isiBalasan,
                progres: progresStatus.toLowerCase().trim()
            }, { withCredentials: true });

            alert("Umpan balik berhasil disimpan dan tercatat di log!");
            setIsModalOpen(false);
            getPengaduan(); // Refresh data tabel otomatis
        } catch (error) {
            alert(error.response?.data?.msg || "Gagal mengirim umpan balik");
        }
    };

    // Fungsi konversi data kategori berbentuk objek/string
    const getKategoriString = (item) => {
        if (!item) return "-";
        if (item.kategori && typeof item.kategori === "object") {
            return item.kategori.ket_kategori || item.kategori.nama_kategori || "-";
        }
        return item.ket_kategori || item.nama_kategori || item.kategori || "-";
    };

    // Format susunan tanggal menjadi Hari-Bulan-Tahun (DD-MM-YYYY) secara aman
    const formatTanggalIndo = (tanggalRaw) => {
        if (!tanggalRaw) return "-";
        const strTanggal = typeof tanggalRaw === "string" ? tanggalRaw : new Date(tanggalRaw).toISOString();
        const tglHanya = strTanggal.substring(0, 10); 
        const komponen = tglHanya.split("-"); 
        if (komponen.length === 3) return `${komponen[2]}-${komponen[1]}-${komponen[0]}`; 
        return tglHanya;
    };

    // Logika pemfilteran data sekaligus pengurutan: UTAMAKAN NON-SELESAI DI ATAS -> SELESAI DI BAWAH
    const dataTerfilter = pengaduan
        .filter((item) => {
            const kategoriTxt = getKategoriString(item);
            const namaSiswaData = item.nama_lengkap || item.user?.nama_lengkap || item.siswa?.nama_lengkap || "";
            const nisSiswaData = item.nis?.toString() || item.user?.nis?.toString() || item.siswa?.nis?.toString() || "";

            const matchesKategori = filterKategori === "Semua" || kategoriTxt.toLowerCase() === filterKategori.toLowerCase();
            const matchesTanggal = !filterTanggal || item.tanggal_pengajuan?.startsWith(filterTanggal);
            const keyword = cariSiswa.toLowerCase();
            const matchesSiswa = namaSiswaData.toLowerCase().includes(keyword) || nisSiswaData.includes(keyword);

            return matchesKategori && matchesTanggal && matchesSiswa;
        })
        .sort((a, b) => {
            // 1. Ekstrak status progres aktif masing-masing baris secara akurat
            const balasanA = a.UmpanBaliks || a.umpan_baliks || a.umpan_balik || [];
            const statusA = (balasanA.length > 0 ? balasanA[balasanA.length - 1].progres : (a.status || "menunggu")).toLowerCase().trim();

            const balasanB = b.UmpanBaliks || b.umpan_baliks || b.umpan_balik || [];
            const statusB = (balasanB.length > 0 ? balasanB[balasanB.length - 1].progres : (b.status || "menunggu")).toLowerCase().trim();

            // 2. Cek status apakah sudah selesai atau belum
            const apakahSelesaiA = statusA === "selesai";
            const apakahSelesaiB = statusB === "selesai";

            // Jika statusnya berbeda (yang satu selesai, yang satu tidak)
            if (apakahSelesaiA !== apakahSelesaiB) {
                return apakahSelesaiA ? 1 : -1; // Yang 'selesai' dilempar ke urutan bawah (1)
            }

            // 3. Jika statusnya sama-sama belum selesai atau sama-sama selesai, urutkan berdasarkan Tanggal Terbaru
            const tanggalA = new Date(a.tanggal_pengajuan || a.createdAt);
            const tanggalB = new Date(b.tanggal_pengajuan || b.createdAt);
            return tanggalB - tanggalA;
        });

    // Fitur mencetak file rekapitulasi data tabel ke format PDF
    const downloadPDF = () => {
        const doc = new jsPDF("l", "mm", "a4");
        doc.setFontSize(16);
        doc.text("Laporan Pengaduan & Aspirasi Sekolah", 14, 15);
        
        const tableColumn = ["No", "Tanggal", "NIS", "Nama Siswa", "Kategori", "Lokasi", "Judul", "Status", "Balasan Admin"];
        const tableRows = [];

        dataTerfilter.forEach((item, index) => {
            const listBalasan = item.UmpanBaliks || item.umpan_baliks || item.umpan_balik || [];
            const teksBalasan = listBalasan.length > 0 ? listBalasan[listBalasan.length - 1].isi_balasan : (item.feedback || "-");
            const statusTxt = listBalasan.length > 0 ? listBalasan[listBalasan.length - 1].progres : (item.status || "menunggu");

            const rowData = [
                index + 1,
                formatTanggalIndo(item.tanggal_pengajuan),
                item.nis || item.user?.nis || item.siswa?.nis || "-",
                item.nama_lengkap || item.user?.nama_lengkap || item.siswa?.nama_lengkap || "-",
                getKategoriString(item),
                item.lokasi || "-",
                item.judul || "-",
                statusTxt.toUpperCase(),
                teksBalasan
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 25,
            theme: 'grid'
        });

        doc.save("Laporan_Pengaduan.pdf");
    };

    // Helper untuk mengekstrak data balasan secara dinamis menggunakan optional chaining
    const getUmpanBalikData = () => {
        if (!selectedAspirasiData) return null;
        const balasan = selectedAspirasiData.UmpanBaliks || selectedAspirasiData.umpan_baliks || selectedAspirasiData.umpan_balik || selectedAspirasiData.UmpanBalik;
        if (balasan) {
            if (Array.isArray(balasan) && balasan.length > 0) {
                return balasan[balasan.length - 1];
            } else if (balasan.isi_balasan) {
                return balasan;
            }
        }
        return null;
    };

    const umpanBalikAktif = getUmpanBalikData();
    const inputStyle = { backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px' };

    return (
        <div className="container mt-4" style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '10px' }}>
            <style>
                {`
                    .input::placeholder, .textarea::placeholder {
                        color: #64748b !important;
                        opacity: 1 !important;
                    }
                    .input, .textarea, .select select {
                        color: #0f172a !important;
                    }
                    .select select {
                        background-color: #ffffff !important;
                        border-color: #cbd5e1 !important;
                    }
                    .modal-card-head {
                        background-color: #ffffff !important;
                        border-bottom: 1px solid #e2e8f0 !important;
                    }
                    .modal-card-title {
                        color: #0f172a !important;
                        font-weight: 700 !important;
                    }
                    .modal-card-body {
                        background-color: #ffffff !important;
                        color: #0f172a !important;
                    }
                    .modal-card-foot {
                        background-color: #ffffff !important;
                        border-top: 1px solid #e2e8f0 !important;
                    }
                `}
            </style>

            <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
                <h1 className="title is-4" style={{ color: '#0f172a', fontWeight: '700' }}>📌 Kelola Pengaduan & Histori</h1>
                <button onClick={downloadPDF} className="button" style={{ backgroundColor: '#2563eb', color: '#ffffff', fontWeight: '600', borderRadius: '6px' }}>
                    <span>🖨️ Cetak Laporan PDF</span>
                </button>
            </div>

            {/* Bagian Filter */}
            <div className="box mb-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: 'none' }}>
                <div className="columns">
                    <div className="column is-4">
                        <label className="label" style={{ color: '#475569', fontWeight: '600' }}>📅 Tanggal</label>
                        <input type="date" className="input" style={inputStyle} value={filterTanggal} onChange={(e) => setFilterTanggal(e.target.value)} />
                    </div>
                    <div className="column is-4">
                        <label className="label" style={{ color: '#475569', fontWeight: '600' }}>🔍 Cari Siswa / NIS</label>
                        <input type="text" className="input" style={inputStyle} placeholder="Ketik nama atau NIS siswa..." value={cariSiswa} onChange={(e) => setCariSiswa(e.target.value)} />
                    </div>
                    <div className="column is-4">
                        <label className="label" style={{ color: '#475569', fontWeight: '600' }}>🗂️ Kategori</label>
                        <div className="select is-fullwidth">
                            <select style={inputStyle} value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)}>
                                <option value="Semua">Semua</option>
                                <option value="Kebersihan">Kebersihan</option>
                                <option value="Keamanan">Keamanan</option>
                                <option value="Fasilitas">Aula</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bagian Tabel */}
            <div className="box" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#ffffff', boxShadow: 'none' }}>
                <div style={{ overflowX: "auto" }}>
                    <table className="table is-fullwidth" style={{ backgroundColor: '#ffffff' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ color: '#0f172a', fontWeight: '700' }}>No</th>
                                <th style={{ color: '#0f172a', fontWeight: '700' }}>Tanggal</th>
                                <th style={{ color: '#0f172a', fontWeight: '700' }}>NIS</th>
                                <th style={{ color: '#0f172a', fontWeight: '700' }}>Nama Siswa</th>
                                <th style={{ color: '#0f172a', fontWeight: '700' }}>Kategori</th>
                                <th style={{ color: '#0f172a', fontWeight: '700' }}>Lokasi</th>
                                <th style={{ color: '#0f172a', fontWeight: '700' }}>Judul</th>
                                <th style={{ color: '#0f172a', fontWeight: '700' }}>Deskripsi</th>
                                <th style={{ color: '#0f172a', fontWeight: '700' }}>Bukti Foto</th>
                                <th style={{ color: '#0f172a', fontWeight: '700' }}>Status</th>
                                <th className="has-text-centered" style={{ color: '#0f172a', fontWeight: '700' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataTerfilter.map((item, index) => {
                                const listBalasan = item.UmpanBaliks || item.umpan_baliks || item.umpan_balik || [];
                                const statusRaw = listBalasan.length > 0 ? listBalasan[listBalasan.length - 1].progres : (item.status || "menunggu");
                                const statusTerkini = statusRaw.toLowerCase().trim();
                                
                                return (
                                    <tr key={item.id_aspirasi || index} style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ color: '#334155', fontWeight: '500' }}>{index + 1}</td>
                                        <td style={{ color: '#334155' }}>{formatTanggalIndo(item.tanggal_pengajuan)}</td>
                                        <td style={{ color: '#0f172a', fontWeight: '600' }}>{item.nis || item.user?.nis || item.siswa?.nis || "-"}</td>
                                        <td style={{ color: '#0f172a', fontWeight: '600' }}>{item.nama_lengkap || item.user?.nama_lengkap || item.siswa?.nama_lengkap || "-"}</td>
                                        <td style={{ color: '#334155' }}>{getKategoriString(item)}</td>
                                        <td style={{ color: '#334155' }}>{item.lokasi || "-"}</td>
                                        <td style={{ color: '#0f172a', fontWeight: '700' }}>{item.judul || "-"}</td>
                                        <td style={{ color: '#334155', maxWidth: '200px', wordBreak: 'break-word' }}>{item.deskripsi || "-"}</td>
                                        <td>
                                            {item.gambar ? (
                                                <img src={`http://localhost:5000/images/${item.gambar}`} alt="bukti" style={{ width: "60px", borderRadius: "6px", border: "1px solid #cbd5e1" }} />
                                            ) : <span style={{ color: '#94a3b8' }}>-</span>}
                                        </td>
                                        <td>
                                            <span className={`tag is-normal has-text-weight-bold ${(statusTerkini === 'selesai' || statusTerkini === 'selkit') ? 'is-success' : statusTerkini === 'diproses' ? 'is-info' : 'is-warning'}`}>
                                                {statusTerkini.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="has-text-centered">
                                            <button onClick={() => handleOpenModal(item)} className="button is-small" style={{ backgroundColor: '#10b981', color: '#ffffff', fontWeight: '600', borderRadius: '4px', border: 'none' }}>
                                                Umpan Balik
                                            </button>
                                        </td>
                                    </tr>
                                );
                             })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* POP-UP BOX DIALOG MODAL */}
            <div className={`modal ${isModalOpen ? "is-active" : ""}`}>
                <div className="modal-background" onClick={() => setIsModalOpen(false)}></div>
                <div className="modal-card" style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', maxHeight: '90vh' }}>
                    <header className="modal-card-head">
                        <p className="modal-card-title">📝 Berikan Umpan Balik</p>
                        <button type="button" className="delete" aria-label="close" onClick={() => setIsModalOpen(false)}></button>
                    </header>
                    <form onSubmit={handleSubmitUmpanBalik} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <section className="modal-card-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            
                            <div className="field mb-4">
                                <label className="label" style={{ color: '#334155', fontWeight: '700' }}>💬 Balasan Kamu Sebelumnya (Histori Terbaru)</label>
                                <div className="p-3" style={{ backgroundColor: '#f1f5f9', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                    {umpanBalikAktif ? (
                                        <div>
                                            <p style={{ color: '#0f172a', fontWeight: '600', fontSize: '0.95rem', marginBottom: '8px' }}>
                                                "{umpanBalikAktif.isi_balasan}"
                                            </p>
                                            <div className="tags">
                                                <span className="tag is-info is-light is-small has-text-weight-bold">
                                                    Progres: {umpanBalikAktif.progres?.toUpperCase()}
                                                </span>
                                                <span className="tag is-light is-small" style={{ color: '#475569' }}>
                                                    📅 {formatTanggalIndo(umpanBalikAktif.tanggal_balasan || umpanBalikAktif.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ color: '#475569', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                            Kamu belum pernah mengirim tanggapan/balasan untuk laporan siswa ini.
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <hr style={{ margin: '15px 0', borderColor: '#e2e8f0' }} />

                            <div className="field mb-4">
                                <label className="label" style={{ color: '#334155', fontWeight: '700' }}>Isi Tanggapan / Tindakan Baru</label>
                                <div className="control">
                                    <textarea 
                                        className="textarea" 
                                        placeholder="Tuliskan respon atau kelanjutan penyelesaian baru di sini..." 
                                        required 
                                        value={isiBalasan} 
                                        onChange={(e) => setIsiBalasan(e.target.value)}
                                        style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a' }}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label" style={{ color: '#334155', fontWeight: '700' }}>Pilih Status Progres Terkini</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select value={progresStatus} onChange={(e) => setProgresStatus(e.target.value)} style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
                                            <option value="menunggu">menunggu</option>
                                            <option value="diproses">diproses</option>
                                            <option value="selkit">selkit</option>
                                            <option value="selesai">selesai</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <footer className="modal-card-foot is-justify-content-flex-end">
                            <button type="submit" className="button is-success" style={{ fontWeight: '600', borderRadius: '6px' }}>
                                Kirim Tanggapan
                            </button>
                            <button type="button" className="button is-light" onClick={() => setIsModalOpen(false)} style={{ fontWeight: '600', borderRadius: '6px', color: '#475569' }}>
                                Batal
                            </button>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default KelolaPengaduan;