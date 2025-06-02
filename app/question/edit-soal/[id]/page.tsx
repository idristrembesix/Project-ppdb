"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosClient } from "@/lib/axiosClient";
import { Loader2, Save, ArrowLeft } from "lucide-react";

export default function EditSoalPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [soal, setSoal] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    mapel: "",
  });

  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const fetchSoal = async () => {
      try {
        const res = await axiosClient.get(`/question/list/${id}`);
        setSoal({
          question: res.data.question,
          options: res.data.options || ["", "", "", ""],
          answer: res.data.answer,
          mapel: res.data.mapel || "",
        });
      } catch (err) {
        setError("Gagal memuat data soal.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSoal();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx?: number) => {
    if (typeof idx === "number") {
      const newOptions = [...soal.options];
      newOptions[idx] = e.target.value;
      setSoal({ ...soal, options: newOptions });
    } else {
      setSoal({ ...soal, [e.target.name]: e.target.value });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSoal({ ...soal, [e.target.name]: e.target.value });
  };

  console.log(soal,'soalllllllllllllllllllll')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await axiosClient.patch(`/question/update/${id}`, soal);
      setSuccess("Soal berhasil diperbarui!");
      setTimeout(() => router.push("/question"), 1200);
    } catch (err) {
      setError("Gagal menyimpan perubahan.");
      // Debug:
      // console.log(err.response || err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  if (!showEdit) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-green-700 hover:underline"
        >
          <ArrowLeft /> Kembali
        </button>
        <h1 className="text-2xl font-bold text-green-900 mb-6">Detail Soal</h1>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100 space-y-4">
          <div>
            <span className="font-semibold text-green-800">Pertanyaan:</span>
            <div className="text-black mt-1">{soal.question}</div>
          </div>
          <div>
            <span className="font-semibold text-green-800">Pilihan Jawaban:</span>
            <ol className="list-decimal pl-5 text-black mt-1">
              {soal.options.map((pil, idx) => (
                <li key={idx}>{pil}</li>
              ))}
            </ol>
          </div>
          <div>
            <span className="font-semibold text-green-800">Jawaban Benar:</span>
            <div className="text-black mt-1">{soal.answer}</div>
          </div>
          <div>
            <span className="font-semibold text-green-800">Kategori:</span>
            <div className="text-black mt-1">{soal.mapel}</div>
          </div>
          <button
            onClick={() => setShowEdit(true)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Edit Soal
          </button>
        </div>
      </div>
    );
  }
  

  return (
    <div className="max-w-2xl mx-auto py-10">
      <button
        onClick={() => setShowEdit(false)}
        className="mb-6 flex items-center gap-2 text-green-700 hover:underline"
      >
        <ArrowLeft /> Kembali ke Detail
      </button>
      <h1 className="text-2xl font-bold text-green-900 mb-6">Edit Soal</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 space-y-5 border border-green-100"
      >
        <div>
          <textarea
            name="question" // <-- harus sama dengan state
            value={soal.question}
            onChange={handleChange}
            className="w-full border rounded p-2 text-black"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-green-800">Pilihan Jawaban</label>
          <div className="grid grid-cols-1 gap-2">
            {soal.options.map((pil, idx) => (
              <input
                key={idx}
                type="text"
                value={pil}
                onChange={(e) => handleChange(e, idx)}
                className="border rounded p-2 text-black"
                placeholder={`Pilihan ${String.fromCharCode(65 + idx)}`}
                required
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-green-800">Jawaban Benar</label>
          <select
            name="jawaban"
            value={soal.answer}
            onChange={handleSelectChange}
            className="border rounded p-2 w-full text-black"
            required
          >
            <option value="">Pilih jawaban benar</option>
            {soal.options.map((pil, idx) => (
              <option key={idx} value={pil}>
                {String.fromCharCode(65 + idx)}. {pil}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-green-800">Kategori</label>
          <input
            type="text"
            name="mapel" // <-- harus sama dengan state
            value={soal.mapel}
            onChange={handleChange}
            className="border rounded p-2 w-full text-black"
            placeholder="Contoh: Matematika"
            required
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-700">{success}</div>}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-60"
        >
          <Save size={18} /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}