"use client";
import { useEffect, useState } from 'react';
import { axiosClient } from '@/lib/axiosClient';
import Sidebar from '@/components/Sidebar';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Edit, Trash2, BookOpen } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
  mapel: string;
}

const PAGE_SIZE = 5;

export default function QuestionPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<{ [mapel: string]: number }>({});
  const router = useRouter();

  useEffect(() => {
    axiosClient.get('/question/list-soal')
      .then((res) => setQuestions(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id: number) => {
    if (confirm('Yakin ingin menghapus soal ini?')) {
      axiosClient.delete(`/question/delete/${id}`)
        .then(() => setQuestions(prev => prev.filter(q => q.id !== id)));
    }
  };

  const handleDetail = (id: number) => {
    router.push(`/question/detail-soal/${id}`);
  };

  // Kelompokkan soal berdasarkan mapel
  const groupedByMapel: { [mapel: string]: Question[] } = {};
  questions.forEach((q) => {
    if (!groupedByMapel[q.mapel]) groupedByMapel[q.mapel] = [];
    groupedByMapel[q.mapel].push(q);
  });

  // Handler untuk ganti halaman per mapel
  const handlePageChange = (mapel: string, page: number) => {
    setCurrentPage((prev) => ({ ...prev, [mapel]: page }));
  };

  const handleEdit = (id: number) => {
    router.push(`/question/edit-soal/${id}`);
  };

  return (
    <div className="grid grid-cols-12 min-h-screen bg-gradient-to-b from-green-100 to-white">
      <Sidebar />
      <main className="col-span-10 p-10 bg-white text-gray-800 rounded-lg shadow-md mx-6 my-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BookOpen size={32} className="text-green-700" />
            <h2 className="text-2xl font-bold text-green-900 drop-shadow">Daftar Soal Ujian</h2>
          </div>
          <Link
            href="/question/tambah"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
          >
            + Tambah Pertanyaan
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <span className="text-green-700 font-semibold text-lg">Memuat data soal...</span>
          </div>
        ) : Object.keys(groupedByMapel).length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            Belum ada soal yang tersedia.
          </div>
        ) : (
          Object.keys(groupedByMapel).map((mapel) => {
            const page = currentPage[mapel] || 1;
            const totalPages = Math.ceil(groupedByMapel[mapel].length / PAGE_SIZE);
            const paginatedQuestions = groupedByMapel[mapel].slice(
              (page - 1) * PAGE_SIZE,
              page * PAGE_SIZE
            );
            return (
              <div key={mapel} className="mb-12">
                <h3 className="text-xl font-bold mb-4 text-green-700 flex items-center gap-2">
                  <BookOpen size={20} /> {mapel}
                </h3>
                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="w-full table-auto bg-white">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="p-3">No</th>
                        <th className="p-3">Pertanyaan</th>
                        <th className="p-3">Opsi</th>
                        <th className="p-3">Jawaban</th>
                        <th className="p-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedQuestions.map((q, i) => (
                        <tr key={q.id} className="odd:bg-white even:bg-green-50">
                          <td className="p-3 text-center">{(page - 1) * PAGE_SIZE + i + 1}</td>
                          <td className="p-3 max-w-xs break-words">{q.question}</td>
                          <td className="p-3">
                            <ul className="list-disc list-inside text-sm">
                              {q.options.map((opt, idx) => <li key={idx}>{opt}</li>)}
                            </ul>
                          </td>
                          <td className="p-3 font-semibold">{q.answer}</td>
                          <td className="p-3 align-middle">
                            <div className="flex flex-row gap-2 justify-center items-center h-full">
                              <button
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                                onClick={() => handleDetail(q.id)}
                                title="Lihat Detail"
                              >
                                <Eye size={16} /> Detail
                              </button>
                              <button
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-1"
                                onClick={() => handleEdit(q.id)}
                                title="Edit Soal"
                              >
                                <Edit size={16} /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(q.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                                title="Hapus Soal"
                              >
                                <Trash2 size={16} /> Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination per mapel */}
                {totalPages > 1 && (
                  <div className="flex gap-2 mt-4">
                    {Array.from({ length: totalPages }, (_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePageChange(mapel, idx + 1)}
                        className={`px-3 py-1 rounded ${
                          page === idx + 1
                            ? "bg-green-600 text-white font-bold"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
