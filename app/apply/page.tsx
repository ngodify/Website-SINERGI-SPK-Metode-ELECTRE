
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Wallet,
  Users,
  Award,
  ArrowRight,
  ArrowLeft,
  FileText,
} from "lucide-react";

type FormData = {
  ipk: string;
  penghasilan: string;
  tanggungan: string;
  jumlahSertifikasi: string;
  sertifikasi: string;
};

type StudentApplication = FormData & {
  id: string;
  studentId: string;
  name: string;
  nim: string;
  email: string;
  status: string;
  submittedAt: string;
  result: string;
};

export default function ApplyPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    ipk: "",
    penghasilan: "",
    tanggungan: "",
    jumlahSertifikasi: "",
    sertifikasi: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // PROSES KIRIM PENDAFTARAN
  // ==========================================

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validasi IPK
    const ipk = Number(formData.ipk);

    if (
      formData.ipk.trim() === "" ||
      !Number.isFinite(ipk) ||
      ipk < 0 ||
      ipk > 4
    ) {
      alert("IPK harus berada di antara 0 sampai 4.");
      return;
    }

    // Validasi penghasilan
    const penghasilan = Number(formData.penghasilan);

    if (
      formData.penghasilan.trim() === "" ||
      !Number.isFinite(penghasilan) ||
      penghasilan < 0
    ) {
      alert("Penghasilan harus berupa angka yang valid.");
      return;
    }

    // Validasi tanggungan
    const tanggungan = Number(formData.tanggungan);

    if (
      formData.tanggungan.trim() === "" ||
      !Number.isInteger(tanggungan) ||
      tanggungan < 0
    ) {
      alert("Jumlah tanggungan harus berupa bilangan bulat.");
      return;
    }

    // Validasi sertifikasi
    const jumlahSertifikasi = Number(
      formData.jumlahSertifikasi
    );

    if (
      formData.jumlahSertifikasi.trim() === "" ||
      !Number.isInteger(jumlahSertifikasi) ||
      jumlahSertifikasi < 0
    ) {
      alert("Jumlah sertifikasi harus berupa bilangan bulat.");
      return;
    }

    if (
      jumlahSertifikasi > 0 &&
      formData.sertifikasi.trim() === ""
    ) {
      alert("Silakan isi nama sertifikasi yang dimiliki.");
      return;
    }

    if (
      jumlahSertifikasi === 0 &&
      formData.sertifikasi.trim() !== "" &&
      formData.sertifikasi.trim().toLowerCase() !== "tidak ada"
    ) {
      alert(
        "Jika tidak memiliki sertifikasi, isi dengan Tidak Ada."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // ==========================================
      // AMBIL IDENTITAS MAHASISWA
      // ==========================================

      const studentId =
        localStorage.getItem("studentId") ||
        crypto.randomUUID();

      localStorage.setItem("studentId", studentId);

      const studentName =
        localStorage.getItem("studentName") || "Mahasiswa";

      const studentNim =
        localStorage.getItem("studentNim") || "-";

      const studentEmail =
        localStorage.getItem("studentEmail") || "-";

      // ==========================================
      // AMBIL DATA PENDAFTAR SEBELUMNYA
      // ==========================================

      const savedApplications = localStorage.getItem(
        "scholarshipApplications"
      );

      let applications: StudentApplication[] = [];

      if (savedApplications) {
        const parsed = JSON.parse(savedApplications);

        if (Array.isArray(parsed)) {
          applications = parsed;
        }
      }

      // ==========================================
      // BUAT DATA PENDAFTARAN BARU
      // ==========================================

      const applicationData: StudentApplication = {
        ...formData,

        id: studentId,
        studentId: studentId,

        name: studentName,
        nim: studentNim,
        email: studentEmail,

        status: "TERKIRIM",

        submittedAt: new Date().toISOString(),

        result: "PENDING",
      };

      // ==========================================
      // CEK APAKAH MAHASISWA SUDAH MENDAFTAR
      // ==========================================

      const existingIndex = applications.findIndex(
        (item) => item.studentId === studentId
      );

      if (existingIndex >= 0) {
        // Update pendaftaran yang sudah ada
        applications[existingIndex] = applicationData;
      } else {
        // Tambahkan mahasiswa baru
        applications.push(applicationData);
      }

      // ==========================================
      // SIMPAN DATA KE LOCAL STORAGE
      // ==========================================

      localStorage.setItem(
        "scholarshipApplications",
        JSON.stringify(applications)
      );

      // Simpan juga untuk kompatibilitas dashboard student lama
      localStorage.setItem(
        "scholarshipApplication",
        JSON.stringify(applicationData)
      );

      // ==========================================
      // BERHASIL
      // ==========================================

      alert("Pendaftaran berhasil dikirim!");

      router.push("/student");

    } catch (error) {
      console.error("Gagal menyimpan data:", error);

      alert(
        "Pendaftaran gagal disimpan. Silakan coba kembali."
      );

      setIsSubmitting(false);
    }
  };

  // ==========================================
  // TAMPILAN FORM
  // ==========================================

  return (
    <main className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">

      {/* BACKGROUND BLUR */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-40 -left-32 w-[500px] h-[500px] bg-blue-300/30 rounded-full blur-[130px]" />

        <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[130px]" />

      </div>

      {/* NAVBAR */}

      <nav className="bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] px-6 py-4 relative z-10">

        <div className="max-w-5xl mx-auto flex items-center gap-3">

          <div className="bg-[#2563EB] p-2 rounded-xl text-white">
            <GraduationCap size={25} />
          </div>

          <span className="font-bold text-xl text-[#172554]">
            Beasiswa
            <span className="text-[#2563EB]">Ku</span>
          </span>

        </div>

      </nav>

      <div className="max-w-3xl mx-auto px-5 py-10 relative z-10">

        {/* HEADING */}

        <div className="mb-8">

          <span className="text-sm font-semibold text-[#2563EB]">
            PENDAFTARAN BEASISWA
          </span>

          <h1 className="text-3xl font-bold text-[#0F172A] mt-2">
            Formulir Pendaftaran
          </h1>

          <p className="text-[#64748B] mt-2">
            Lengkapi informasi berikut dengan data yang benar
            untuk mengikuti proses seleksi beasiswa.
          </p>

        </div>

        {/* PROGRESS */}

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-center gap-3">

          <FileText className="text-[#2563EB]" size={24} />

          <div>

            <p className="font-semibold text-[#172554]">
              4 Kriteria Penilaian
            </p>

            <p className="text-sm text-[#2563EB]">
              Seluruh informasi akan digunakan dalam proses seleksi.
            </p>

          </div>

        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 1. IPK */}

          <section className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-blue-100 p-3 rounded-xl text-[#2563EB]">
                <GraduationCap size={23} />
              </div>

              <div>

                <h2 className="font-bold text-lg text-[#0F172A]">
                  01. Informasi Akademik
                </h2>

                <p className="text-sm text-[#64748B]">
                  Masukkan nilai IPK terakhir.
                </p>

              </div>

            </div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Indeks Prestasi Kumulatif (IPK)
            </label>

            <input
              type="number"
              name="ipk"
              value={formData.ipk}
              onChange={handleChange}
              placeholder="Contoh: 3.75"
              min="0"
              max="4"
              step="0.01"
              required
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-slate-400 mt-2">
              Masukkan IPK dalam skala 0.00 – 4.00.
            </p>

          </section>

          {/* 2. PENGHASILAN */}

          <section className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                <Wallet size={23} />
              </div>

              <div>

                <h2 className="font-bold text-lg text-[#0F172A]">
                  02. Kondisi Ekonomi
                </h2>

                <p className="text-sm text-[#64748B]">
                  Informasi penghasilan orang tua.
                </p>

              </div>

            </div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Total Penghasilan Orang Tua per Bulan
            </label>

            <div className="flex items-center border border-[#E2E8F0] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">

              <span className="bg-slate-100 px-4 py-3 text-slate-600 font-medium">
                Rp
              </span>

              <input
                type="number"
                name="penghasilan"
                value={formData.penghasilan}
                onChange={handleChange}
                placeholder="Contoh: 3000000"
                min="0"
                required
                className="w-full px-4 py-3 outline-none"
              />

            </div>

            <p className="text-xs text-slate-400 mt-2">
              Masukkan total penghasilan gabungan orang tua dalam satu bulan.
            </p>

          </section>

          {/* 3. TANGGUNGAN */}

          <section className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                <Users size={23} />
              </div>

              <div>

                <h2 className="font-bold text-lg text-[#0F172A]">
                  03. Tanggungan Keluarga
                </h2>

                <p className="text-sm text-[#64748B]">
                  Informasi jumlah anggota keluarga yang ditanggung.
                </p>

              </div>

            </div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Jumlah Tanggungan Orang Tua
            </label>

            <input
              type="number"
              name="tanggungan"
              value={formData.tanggungan}
              onChange={handleChange}
              placeholder="Contoh: 4"
              min="0"
              step="1"
              required
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-slate-400 mt-2">
              Jumlah anggota keluarga yang menjadi tanggungan ekonomi orang tua.
            </p>

          </section>

          {/* 4. SERTIFIKASI */}

          <section className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                <Award size={23} />
              </div>

              <div>

                <h2 className="font-bold text-lg text-[#0F172A]">
                  04. Sertifikasi
                </h2>

                <p className="text-sm text-[#64748B]">
                  Informasi sertifikasi yang pernah diperoleh.
                </p>

              </div>

            </div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Jumlah Sertifikasi
            </label>

            <input
              type="number"
              name="jumlahSertifikasi"
              value={formData.jumlahSertifikasi}
              onChange={handleChange}
              placeholder="Contoh: 3"
              min="0"
              step="1"
              required
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm font-semibold text-slate-700 mt-5 mb-2">
              Daftar Sertifikasi
            </label>

            <textarea
              name="sertifikasi"
              value={formData.sertifikasi}
              onChange={handleChange}
              placeholder={
                "Contoh:\n1. Google Data Analytics\n2. Microsoft Office Specialist\n3. AWS Cloud Practitioner"
              }
              rows={4}
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <p className="text-xs text-slate-400 mt-2">
              Tuliskan nama sertifikasi yang dimiliki. Jika belum
              memiliki sertifikasi, tuliskan Tidak Ada.
            </p>

          </section>

          {/* PERHATIAN */}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">

            <p className="text-sm text-amber-800">
              <strong>Perhatian:</strong> Pastikan seluruh data
              yang dimasukkan sudah benar. Data akan digunakan
              sebagai dasar penilaian seleksi beasiswa.
            </p>

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-3">

            <button
              type="button"
              onClick={() => router.push("/login")}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-[#E2E8F0] rounded-xl text-[#64748B] font-semibold hover:bg-slate-100 transition"
            >
              <ArrowLeft size={18} />
              Kembali
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md shadow-blue-200"
            >
              {isSubmitting
                ? "Mengirim Pendaftaran..."
                : "Kirim Pendaftaran"}

              <ArrowRight size={18} />
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}
