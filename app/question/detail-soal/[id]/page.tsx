"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosClient } from "@/lib/axiosClient";
import { ArrowLeft, Loader2, BookOpen, ListOrdered, CheckCircle, Tag } from "lucide-react";

export default function DetailSoalPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [soal, setSoal] = useState<{
    question: string;
    options: string[];
    answer: string;
    mapel: string;
  } | null>(null);

  useEffect(() => {
    const fetchSoal = async () => {
      try {
        const res = await axiosClient.get(`/question/list/${id}`);
        setSoal({
          question: res.data.question,
          options: res.data.options || [],
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  if (error || !soal) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-green-700 hover:underline"
        >
          <ArrowLeft /> Kembali
        </button>
        <div className="text-red-600">{error || "Soal tidak ditemukan."}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-green-700 hover:underline"
      >
        <ArrowLeft /> Kembali
      </button>
      <div className="flex items-center gap-3 mb-6">
        <BookOpen size={32} className="text-green-700" />
        <h1 className="text-2xl font-bold text-green-900 drop-shadow">Detail Soal Ujian</h1>
      </div>
      <div className="bg-gradient-to-br from-green-50 via-white to-green-100 rounded-xl shadow-lg p-8 border border-green-200 space-y-6">
        <div className="flex items-start gap-3">
          <span className="mt-1">
            <ListOrdered size={22} className="text-green-600" />
          </span>
          <div>
            <span className="font-semibold text-green-800">question:</span>
            <div className="text-black mt-1 text-lg">{soal.question}</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-1">
            <ListOrdered size={22} className="text-yellow-600" />
          </span>
          <div>
            <span className="font-semibold text-yellow-700">options:</span>
            <ol className="list-decimal pl-5 text-black mt-1 space-y-1">
              {soal.options.map((pil, idx) => (
                <li
                  key={idx}
                  className={`${
                    pil === soal.answer
                      ? "bg-green-100 border-l-4 border-green-500 font-bold"
                      : ""
                  } px-2 py-1 rounded`}
                >
                  {pil}
                  {pil === soal.answer && (
                    <span className="ml-2 text-green-700 font-semibold flex items-center gap-1 inline">
                      <CheckCircle size={16} /> Jawaban Benar
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle size={22} className="text-green-700" />
          <span>
            <span className="font-semibold text-green-800">Answer:</span>
            <span className="text-black ml-2 font-bold">{soal.answer}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Tag size={22} className="text-blue-700" />
          <span>
            <span className="font-semibold text-blue-800">Mapel:</span>
            <span className="text-black ml-2">{soal.mapel}</span>
          </span>
        </div>
      </div>
    </div>
  );
}