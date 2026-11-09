
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  Bell,
  LogOut,
  Clock,
  CheckCircle2,
  Wallet,
  Users,
  Award,
  BookOpen,
  CalendarDays,
  AlertCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

// ==========================================
// TIPE DATA PENDAFTARAN
// ==========================================

type ApplicationData = {
  ipk: string;
  penghasilan: string;
  tanggungan: string;
  jumlahSertifikasi: string;
  sertifikasi: string;
  status: string;
  submittedAt: string;
  result: "PENDING" | "LOLOS" | "TIDAK_LOLOS";
};

// ==========================================
// PENGATURAN PENGUMUMAN
// ==========================================

// Ganti tanggal sesuai jadwal pengumuman beasiswa.
const ANNOUNCEMENT_DATE = new Date(
  "2026-12-01T09:00:00+07:00"
).getTime();

// ==========================================
// DASHBOARD STUDENT
// ==========================================

export default function StudentDashboard() {
  const router = useRouter();

  // Data mahasiswa (sementara simulasi)
  const student = {
    name: "Nabila Salwa",
    nim: "2400012345",
    email: "nabila@email.com",
  };

  // State data pendaftaran
  const [application, setApplication] =
    useState<ApplicationData | null>(null);

  const [loaded, setLoaded] = useState(false);

  // State countdown
  const [now, setNow] = useState(0);

  // ==========================================
  // AMBIL DATA DARI LOCAL STORAGE
  // ==========================================

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "scholarshipApplication"
      );

      if (saved) {
        setApplication(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Gagal membaca data pendaftaran:", error);
    }

    setLoaded(true);
  }, []);

  // ==========================================
  // COUNTDOWN PENGUMUMAN
  // ==========================================

  useEffect(() => {
    setNow(Date.now());

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const remaining = Math.max(
    0,
    ANNOUNCEMENT_DATE - now
  );

  const days = Math.floor(
    remaining / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (remaining / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (remaining / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (remaining / 1000) % 60
  );

  // ==========================================
  // STATUS PENDAFTARAN
  // ==========================================

  const isSubmitted =
    application?.status === "TERKIRIM";

  const result = application?.result ?? "PENDING";

  const isAnnounced =
    result === "LOLOS" || result === "TIDAK_LOLOS";

  // ==========================================
  // FORMAT RUPIAH
  // ==========================================

  const formatRupiah = (value: string) => {
    if (!value) return "-";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p className="text-[#64748B] font-medium">
          Memuat dashboard...
        </p>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN DASHBOARD
  // ==========================================

  return (
    <main className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">

      {/* BACKGROUND BLUR */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        <div className="absolute -top-40 -left-32 w-[500px] h-[500px] bg-blue-300/30 rounded-full blur-[130px]" />

        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[140px]" />

        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-sky-200/30 rounded-full blur-[120px]" />

      </div>

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 hidden md:flex flex-col w-64 h-screen bg-[#172554] p-6 z-20">

        {/* LOGO */}

        <div className="flex items-center gap-3 mb-12">

          <div className="bg-[#2563EB] p-2 rounded-xl text-white">
            <GraduationCap size={25} />
          </div>

          <span className="font-bold text-xl text-white">
            Beasiswa
            <span className="text-blue-400">Ku</span>
          </span>

        </div>

        {/* MENU */}

        <p className="text-xs font-semibold text-blue-300 mb-4">
          MENU UTAMA
        </p>

        <div className="space-y-2">

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#2563EB] text-white font-semibold">
            <LayoutDashboard size={20} />
            Dashboard
          </div>

          <button
            onClick={() => router.push("/apply")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-white/10 transition"
          >
            <FileText size={20} />
            Formulir Beasiswa
          </button>

          <button
            onClick={() =>
              document.getElementById("pengumuman")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-white/10 transition"
          >
            <Bell size={20} />
            Pengumuman
          </button>

        </div>

        {/* LOGOUT */}

        <div className="mt-auto">

          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-3 text-red-300 px-4 py-3 hover:bg-white/10 rounded-xl w-full transition"
          >
            <LogOut size={20} />
            Keluar
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <div className="md:ml-64 relative z-10">

        {/* TOPBAR */}

        <header className="bg-white/60 backdrop-blur-2xl border-b border-white/80 px-6 py-5 flex items-center justify-between sticky top-0 z-10">

          <div>
            <h1 className="text-xl font-bold text-[#0F172A]">
              Dashboard Student
            </h1>

            <p className="text-sm text-[#64748B]">
              Pantau proses pendaftaran beasiswamu.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="bg-[#2563EB] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              {student.name.charAt(0)}
            </div>

            <div className="hidden sm:block">
              <p className="font-semibold text-sm text-[#0F172A]">
                {student.name}
              </p>

              <p className="text-xs text-[#64748B]">
                Student
              </p>
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="p-6 lg:p-8 max-w-6xl mx-auto">

          {/* WELCOME */}

          <div className="mb-8">

            <p className="text-sm font-semibold text-[#2563EB]">
              STUDENT DASHBOARD
            </p>

            <h2 className="text-3xl font-bold text-[#0F172A] mt-2">
              Halo, {student.name.split(" ")[0]}! 👋
            </h2>

            <p className="text-[#64748B] mt-2">
              Selamat datang di dashboard pendaftaran SINERGI.
            </p>

          </div>

          {/* STATUS PENDAFTARAN */}

          <section className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-2xl p-6 mb-8 shadow-lg shadow-blue-900/5">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-blue-100 p-3 rounded-xl text-[#2563EB]">
                <FileText size={24} />
              </div>

              <div>
                <h3 className="font-bold text-lg text-[#0F172A]">
                  Status Pendaftaran
                </h3>

                <p className="text-sm text-[#64748B]">
                  Informasi proses pengajuan beasiswa.
                </p>
              </div>

            </div>

            {!isSubmitted ? (

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">

                <div className="flex items-center gap-3">

                  <AlertCircle
                    size={30}
                    className="text-[#F59E0B]"
                  />

                  <div>
                    <h4 className="font-bold text-amber-800">
                      Belum Mengirim Pendaftaran
                    </h4>

                    <p className="text-sm text-amber-700 mt-1">
                      Kamu belum mengirim formulir pendaftaran beasiswa.
                    </p>
                  </div>

                </div>

                <button
                  onClick={() => router.push("/apply")}
                  className="mt-4 bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
                >
                  Isi Form Pendaftaran
                  <ArrowRight size={17} />
                </button>

              </div>

            ) : (

              <div className="bg-green-50 border border-green-200 rounded-xl p-5">

                <div className="flex items-center gap-3">

                  <CheckCircle2
                    size={30}
                    className="text-[#16A34A]"
                  />

                  <div>
                    <h4 className="font-bold text-green-800">
                      Pendaftaran Berhasil Terkirim
                    </h4>

                    <p className="text-sm text-green-700 mt-1">
                      Data pendaftaran kamu sudah berhasil disimpan.
                    </p>
                  </div>

                </div>

                <div className="mt-4 pt-4 border-t border-green-200">

                  <p className="text-xs text-green-700">
                    Tanggal pengajuan
                  </p>

                  <p className="font-semibold text-green-900 mt-1">
                    {new Date(
                      application!.submittedAt
                    ).toLocaleString("id-ID")}
                  </p>

                </div>

              </div>

            )}

          </section>

          {/* COUNTDOWN */}

          <section className="bg-gradient-to-br from-[#172554] to-[#2563EB] rounded-2xl p-6 md:p-8 mb-8 text-white shadow-xl shadow-blue-900/10">

            <div className="flex items-center gap-3 mb-6">

              <div className="bg-white/15 p-3 rounded-xl">
                <CalendarDays size={25} />
              </div>

              <div>
                <h3 className="font-bold text-xl">
                  Countdown Pengumuman
                </h3>

                <p className="text-sm text-blue-100">
                  Hitung mundur menuju hasil seleksi beasiswa.
                </p>
              </div>

            </div>

            {remaining > 0 ? (

              <div className="grid grid-cols-4 gap-3">

                {[
                  { label: "Hari", value: days },
                  { label: "Jam", value: hours },
                  { label: "Menit", value: minutes },
                  { label: "Detik", value: seconds },
                ].map((item) => (

                  <div
                    key={item.label}
                    className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-xl p-3 md:p-5 text-center"
                  >

                    <p className="text-2xl md:text-4xl font-bold">
                      {String(item.value).padStart(2, "0")}
                    </p>

                    <p className="text-xs md:text-sm text-blue-100 mt-2">
                      {item.label}
                    </p>

                  </div>

                ))}

              </div>

            ) : (

              <div className="bg-white/15 border border-white/20 rounded-xl p-5">

                <h4 className="font-bold text-lg">
                  Waktu Pengumuman Telah Tiba!
                </h4>

                <p className="text-sm text-blue-100 mt-2">
                  Silakan periksa bagian hasil seleksi di bawah.
                </p>

              </div>

            )}

            <div className="flex items-center gap-2 mt-5 text-sm text-blue-100">
              <CalendarDays size={16} />

              Pengumuman: 1 Desember 2026, pukul 09.00 WIB
            </div>

          </section>

          {/* INFORMASI MAHASISWA */}

          <section className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-2xl p-6 mb-8 shadow-lg shadow-blue-900/5">

            <h3 className="font-bold text-lg text-[#0F172A] mb-5">
              Informasi Mahasiswa
            </h3>

            <div className="grid sm:grid-cols-2 gap-5">

              <div>
                <p className="text-sm text-[#64748B] mb-1">
                  Nama Lengkap
                </p>

                <p className="font-semibold text-[#0F172A]">
                  {student.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#64748B] mb-1">
                  Nomor Induk Mahasiswa
                </p>

                <p className="font-semibold text-[#0F172A]">
                  {student.nim}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#64748B] mb-1">
                  Email
                </p>

                <p className="font-semibold text-[#0F172A]">
                  {student.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#64748B] mb-1">
                  Jenis Pengguna
                </p>

                <p className="font-semibold text-[#2563EB]">
                  Student
                </p>
              </div>

            </div>

          </section>

          {/* KRITERIA PENILAIAN */}

          <section className="mb-8">

            <div className="mb-5">
              <h3 className="font-bold text-lg text-[#0F172A]">
                Kriteria Penilaian
              </h3>

              <p className="text-sm text-[#64748B] mt-1">
                Data kriteria yang digunakan dalam seleksi beasiswa.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* IPK */}

              <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-2xl p-5 shadow-sm">

                <GraduationCap
                  className="text-[#2563EB] mb-3"
                  size={25}
                />

                <p className="text-sm text-[#64748B]">
                  IPK
                </p>

                <p className="text-xl font-bold text-[#0F172A] mt-1">
                  {isSubmitted
                    ? application!.ipk
                    : "Belum Ada Data"}
                </p>

              </div>

              {/* PENGHASILAN */}

              <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-2xl p-5 shadow-sm">

                <Wallet
                  className="text-[#16A34A] mb-3"
                  size={25}
                />

                <p className="text-sm text-[#64748B]">
                  Penghasilan Orang Tua
                </p>

                <p className="text-xl font-bold text-[#0F172A] mt-1">
                  {isSubmitted
                    ? formatRupiah(application!.penghasilan)
                    : "Belum Ada Data"}
                </p>

              </div>

              {/* TANGGUNGAN */}

              <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-2xl p-5 shadow-sm">

                <Users
                  className="text-[#F59E0B] mb-3"
                  size={25}
                />

                <p className="text-sm text-[#64748B]">
                  Jumlah Tanggungan
                </p>

                <p className="text-xl font-bold text-[#0F172A] mt-1">
                  {isSubmitted
                    ? `${application!.tanggungan} Orang`
                    : "Belum Ada Data"}
                </p>

              </div>

              {/* SERTIFIKASI */}

              <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-2xl p-5 shadow-sm">

                <Award
                  className="text-purple-600 mb-3"
                  size={25}
                />

                <p className="text-sm text-[#64748B]">
                  Sertifikasi
                </p>

                <p className="text-xl font-bold text-[#0F172A] mt-1">
                  {isSubmitted
                    ? `${application!.jumlahSertifikasi} Sertifikat`
                    : "Belum Ada Data"}
                </p>

              </div>

            </div>

            {/* DETAIL SERTIFIKASI */}

            {isSubmitted && application!.sertifikasi && (

              <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-2xl p-5 mt-4 shadow-sm">

                <div className="flex items-center gap-2 mb-3">
                  <BookOpen
                    size={20}
                    className="text-[#2563EB]"
                  />

                  <h4 className="font-semibold text-[#0F172A]">
                    Detail Sertifikasi
                  </h4>
                </div>

                <p className="text-sm text-[#64748B] whitespace-pre-line">
                  {application!.sertifikasi}
                </p>

              </div>

            )}

          </section>

          {/* HASIL AKHIR SELEKSI */}

          <section className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-2xl p-6 mb-8 shadow-lg shadow-blue-900/5">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-blue-100 p-3 rounded-xl text-[#2563EB]">
                <Award size={23} />
              </div>

              <div>
                <h3 className="font-bold text-lg text-[#0F172A]">
                  Hasil Akhir Seleksi
                </h3>

                <p className="text-sm text-[#64748B]">
                  Hasil seleksi berdasarkan perhitungan ELECTRE.
                </p>
              </div>

            </div>

            {!isSubmitted ? (

              <div className="bg-slate-100 rounded-xl p-5">
                <p className="font-semibold text-slate-700">
                  Belum Ada Hasil
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Kamu belum mengirim formulir pendaftaran.
                </p>
              </div>

            ) : result === "PENDING" ? (

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-center gap-3">

                <Clock
                  size={30}
                  className="text-[#2563EB]"
                />

                <div>
                  <h4 className="font-bold text-[#2563EB]">
                    Menunggu Pengumuman
                  </h4>

                  <p className="text-sm text-[#64748B] mt-1">
                    Hasil seleksi belum diumumkan oleh administrator.
                  </p>
                </div>

              </div>

            ) : result === "LOLOS" ? (

              <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-center gap-3">

                <CheckCircle2
                  size={35}
                  className="text-[#16A34A]"
                />

                <div>
                  <h4 className="font-bold text-lg text-[#16A34A]">
                    SELAMAT! KAMU LOLOS
                  </h4>

                  <p className="text-sm text-green-700 mt-1">
                    Kamu dinyatakan lolos seleksi beasiswa.
                  </p>
                </div>

              </div>

            ) : (

              <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-center gap-3">

                <XCircle
                  size={35}
                  className="text-[#DC2626]"
                />

                <div>
                  <h4 className="font-bold text-lg text-[#DC2626]">
                    BELUM LOLOS SELEKSI
                  </h4>

                  <p className="text-sm text-red-700 mt-1">
                    Terima kasih telah mengikuti proses seleksi beasiswa.
                  </p>
                </div>

              </div>

            )}

          </section>

          {/* PENGUMUMAN */}

          <section
            id="pengumuman"
            className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-2xl p-6 shadow-lg shadow-blue-900/5"
          >

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-blue-100 p-3 rounded-xl text-[#2563EB]">
                <Bell size={22} />
              </div>

              <div>
                <h3 className="font-bold text-lg text-[#0F172A]">
                  Pengumuman Beasiswa
                </h3>

                <p className="text-sm text-[#64748B]">
                  Informasi hasil seleksi penerimaan beasiswa.
                </p>
              </div>

            </div>

            {isAnnounced ? (

              <div className="bg-green-50 border border-green-200 rounded-xl p-5">

                <h4 className="font-bold text-green-800">
                  Pengumuman Hasil Seleksi
                </h4>

                <p className="text-sm text-green-700 mt-2">
                  Hasil seleksi beasiswa sudah tersedia.
                  Silakan lihat bagian Hasil Akhir Seleksi.
                </p>

              </div>

            ) : (

              <div className="border border-dashed border-[#E2E8F0] rounded-xl p-8 text-center">

                <Clock
                  size={35}
                  className="text-[#64748B] mx-auto mb-3"
                />

                <h4 className="font-semibold text-[#0F172A]">
                  Belum Ada Pengumuman
                </h4>

                <p className="text-sm text-[#64748B] mt-2">
                  Hasil seleksi akan ditampilkan di sini
                  setelah Admin menyelesaikan proses
                  perhitungan dan mengumumkan hasil ELECTRE.
                </p>

              </div>

            )}

          </section>

          {/* FOOTER */}

          <footer className="text-center text-sm text-[#64748B] mt-10 pb-5">
            © 2026 SINERGI — Sistem Informasi Penerimaan Beasiswa Terintegrasi.
          </footer>

        </div>

      </div>

    </main>
  );
}
