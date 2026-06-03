import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAspirasi = () => {
  const [judul, setJudul] = useState("");
  const [idKategori, setIdKategori] = useState("");
  const [namaKategori, setNamaKategori] = useState(""); 
  const [lokasi, setLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState("");
  const [kategori, setKategori] = useState([]);
  
  // Menampung opsi lokasi murni real-time dari database Admin
  const [opsiLokasiTersedia, setOpsiLokasiTersedia] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getKategori();
  }, []);

  const getKategori = async () => {
    const response = await axios.get("http://localhost:5000/kategori");
    setKategori(response.data);
  };

  const handleKategoriChange = (e) => {
    const selectedId = e.target.value;
    const selectedCat = kategori.find((kat) => kat.id_kategori === parseInt(selectedId));
    
    setIdKategori(selectedId);
    setNamaKategori(selectedCat ? selectedCat.ket_kategori : "");
    
    // Membaca murni array dari database relasi backend
    setOpsiLokasiTersedia(selectedCat && selectedCat.lokasis ? selectedCat.lokasis : []);
    setLokasi(""); 
  };

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
  };

  const saveAspirasi = async (e) => {
    e.preventDefault();

    // 🌟 KUNCI VALIDASI: Mencegah submit jika file foto kosong atau input hanya berisi spasi
    if (!file) {
      alert("Gagal mengirim! Anda wajib mengunggah Bukti Foto sebagai kelengkapan laporan.");
      return; 
    }
    if (!judul.trim() || !idKategori || !lokasi || !deskripsi.trim()) {
      alert("Gagal mengirim! Seluruh kolom data teks wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("id_kategori", idKategori);
    formData.append("lokasi", lokasi);
    formData.append("deskripsi", deskripsi);
    formData.append("gambar", file);
    formData.append("id_siswa", localStorage.getItem("id_user"));
    formData.append("kode_aspirasi", `ASP-${Date.now()}`);

    try {
      await axios.post("http://localhost:5000/aspirasi", formData, {
        headers: { "Content-type": "multipart/form-data" },
      });
      alert("Aspirasi Anda berhasil dikirim!");
      navigate("/history");
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan saat mengirim aspirasi.");
    }
  };

  // STYLE: Memastikan warna teks yang diketik/dipilih adalah abu-abu gelap kehitaman (#1e293b)
  const formInputStyle = {
    backgroundColor: "#ffffff",
    color: "#1e293b",
    fontWeight: "500",
    borderColor: "#cbd5e1",
    borderRadius: "5px"
  };

  return (
    <div className="container mt-5">
      {/* FORCE STYLE CSS: Memaksa tulisan placeholder dan select box agar berwarna tajam dan jelas */}
      <style>{`
        .input::placeholder, .textarea::placeholder {
          color: #475569 !important;
          opacity: 1 !important;
        }
        .input::-webkit-input-placeholder, .textarea::-webkit-input-placeholder {
          color: #475569 !important;
          opacity: 1 !important;
        }
        .input::-moz-placeholder, .textarea::-moz-placeholder {
          color: #475569 !important;
          opacity: 1 !important;
        }
        select {
          color: #1e293b !important;
          font-weight: 500;
        }
        .file-name {
          color: #1e293b !important;
          font-weight: 500;
        }
      `}</style>

      <div className="columns is-centered">
        <div className="column is-11"> 
          <div className="box" style={{ backgroundColor: 'white', color: '#0f172a', borderRadius: '10px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h1 className="title is-4 has-text-link has-text-centered mb-5">Kirim Aspirasi Baru</h1>
            <hr style={{ backgroundColor: '#e2e8f0' }} />
            
            <form onSubmit={saveAspirasi}>
              <div className="columns is-multiline">
                {/* Judul Laporan */}
                <div className="column is-6">
                  <div className="field">
                    <label className="label has-text-dark">Judul Laporan</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        style={formInputStyle}
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                        placeholder="Contoh: Fasilitas Kelas"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Kategori */}
                <div className="column is-6">
                  <div className="field">
                    <label className="label has-text-dark">Kategori</label>
                    <div className="control is-expanded">
                      <div className="select is-fullwidth">
                        <select 
                          style={formInputStyle}
                          value={idKategori} 
                          onChange={handleKategoriChange}
                          required
                        >
                          <option value="">Pilih Kategori</option>
                          {kategori.map((kat) => (
                            <option key={kat.id_kategori} value={kat.id_kategori}>
                              {kat.ket_kategori}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lokasi Kejadian */}
                <div className="column is-12">
                  <div className="field">
                    <label className="label has-text-dark">Lokasi Kejadian</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          style={{
                            ...formInputStyle, 
                            backgroundColor: !namaKategori ? "#f1f5f9" : "#ffffff",
                            color: !namaKategori ? "#64748b" : "#1e293b"
                          }}
                          value={lokasi}
                          onChange={(e) => setLokasi(e.target.value)}
                          required
                          disabled={!namaKategori}
                        >
                          <option value="">
                            {namaKategori ? `-- Pilih Lokasi ${namaKategori} --` : "Pilih Kategori Terlebih Dahulu"}
                          </option>
                          
                          {/* Loop murni membaca kolom 'nama_lokasi' dari database */}
                          {namaKategori && opsiLokasiTersedia.map((item) => (
                            <option key={item.id_lokasi} value={item.nama_lokasi}>
                              {item.nama_lokasi}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="column is-12">
                  <div className="field">
                    <label className="label has-text-dark">Isi Aspirasi (Deskripsi)</label>
                    <div className="control">
                      <textarea
                        className="textarea"
                        style={formInputStyle}
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        placeholder="Ceritakan detail aspirasimu..."
                        rows="5"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Bukti Foto */}
                <div className="column is-12">
                  <div className="field">
                    <label className="label has-text-dark">Bukti Foto</label>
                    <div className="file has-name is-fullwidth">
                      <label className="file-label">
                        {/* Atribut required bawaan HTML */}
                        <input className="file-input" type="file" onChange={loadImage} required />
                        <span className="file-cta" style={{ backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' }}>
                          <span className="file-label" style={{ color: '#475569', fontWeight: '500' }}>Pilih Gambar...</span>
                        </span>
                        <span className="file-name" style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}>
                          {file ? file.name : "Belum ada file dipilih"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="field mt-5">
                <button 
                  type="submit" 
                  className="button is-link is-fullwidth has-text-weight-bold" 
                  style={{ backgroundColor: '#3273dc', color: '#ffffff', borderRadius: '5px' }}
                >
                  🚀 KIRIM SEKARANG
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAspirasi;