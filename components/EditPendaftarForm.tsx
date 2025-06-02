"use client";

import React, { useEffect, useState } from "react";
import { axiosClient } from "@/lib/axiosClient";
import { useRouter } from "next/navigation";

interface EditPendaftarFormProps {
  id: string;
}

export function EditPendaftarForm({ id }: EditPendaftarFormProps) {
  const [form, setForm] = useState({
    nama: "",
    nis: "",
    nisn: "",
    nik: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    asalSekolah: "",
    noTelpSiswa: "",
    alamatSiswa: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/pendaftar/detail-siswa/${id}`)
      .then((res) => {
        setForm({
          nama: res.data.data.nama ?? "",
          nis: res.data.data.nis ?? "",
          nisn: res.data.data.nisn ?? "",
          nik: res.data.data.nik ?? "",
          tempatLahir: res.data.data.tempatLahir ?? "",
          tanggalLahir: res.data.data.tanggalLahir ?? "",
          jenisKelamin: res.data.data.jenisKelamin ?? "",
          asalSekolah: res.data.data.asalSekolah ?? "",
          noTelpSiswa: res.data.data.noTelpSiswa ?? "",
          alamatSiswa: res.data.data.alamatSiswa ?? "",
        });
      })
      .catch(() => setError("Gagal mengambil data pendaftar"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await axiosClient.post(`/pendaftar/update-siswa/${id}`, form);
      alert("Data berhasil diupdate!");
      router.push(`/pendaftar/detail/${id}`);
    } catch {
      setError("Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Memuat data...</div>;
  }
  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-100 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-green-100 p-10">
        <h1 className="text-3xl font-extrabold mb-2 text-center text-green-800 drop-shadow">
          Edit Data Pendaftar
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Silakan perbarui data pendaftar di bawah ini dengan benar.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-semibold text-black">Nama</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-green-400">
                  <i className="fa fa-user" />
                </span>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                  placeholder="Nama lengkap"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-black">NIS</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-green-400">
                  <i className="fa fa-id-card" />
                </span>
                <input
                  type="text"
                  name="nis"
                  value={form.nis}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-10 py-2 bg-gray-100 cursor-not-allowed text-gray-500 text-black"
                  placeholder="NIS"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-black">NISN</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-green-400">
                  <i className="fa fa-id-badge" />
                </span>
                <input
                  type="text"
                  name="nisn"
                  value={form.nisn}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                  placeholder="NISN"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-black">NIK</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-green-400">
                  <i className="fa fa-address-card" />
                </span>
                <input
                  type="text"
                  name="nik"
                  value={form.nik}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                  placeholder="NIK"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-semibold text-black">Tempat Lahir</label>
              <input
                type="text"
                name="tempatLahir"
                value={form.tempatLahir}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                placeholder="Contoh: Bandung"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-black">Tanggal Lahir</label>
              <input
                type="date"
                name="tanggalLahir"
                value={form.tanggalLahir}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                placeholder="Tanggal Lahir"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-semibold text-black">Jenis Kelamin</label>
              <select
                name="jenisKelamin"
                value={form.jenisKelamin}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-semibold text-black">Asal Sekolah</label>
              <input
                type="text"
                name="asalSekolah"
                value={form.asalSekolah}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                placeholder="Asal sekolah"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-black">No. Telepon</label>
              <input
                type="text"
                name="noTelp"
                value={form.noTelpSiswa}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-black">Alamat</label>
            <textarea
              name="alamat"
              value={form.alamatSiswa}
              onChange={handleChange}
              rows={3}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
              placeholder="Alamat lengkap"
            />
          </div>
          {error && (
            <div className="text-center text-red-600 font-semibold">{error}</div>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-green-600 to-yellow-400 hover:from-green-700 hover:to-yellow-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 text-lg tracking-wide mt-2"
          >
            {saving ? (
              <span>
                <i className="fa fa-spinner fa-spin mr-2" /> Menyimpan...
              </span>
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
