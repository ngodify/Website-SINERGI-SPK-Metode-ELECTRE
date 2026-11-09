
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calculator,
  Trophy,
  Settings,
  LogOut,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  SlidersHorizontal,
  Award,
} from "lucide-react";

// ==========================================
// TIPE DATA
// ==========================================

type Student = {
  id: string;
  studentId?: string;
  name?: string;
  nim?: string;
  email?: string;
  ipk: string;
  penghasilan: string;
  tanggungan: string;
  jumlahSertifikasi: string;
  sertifikasi: string;
  status: string;
  submittedAt: string;
  result: string;
};

type Criterion = {
  key: keyof Student;
  name: string;
  weight: number;
  type: "benefit" | "cost";
};

type ElectreResult = {
  student: Student;
  score: number;
  rank: number;
  concordance: number;
  discordance: number;
  selected: boolean;
};

// ==========================================
// KRITERIA ELECTRE
// ==========================================

const INITIAL_CRITERIA: Criterion[] = [
  {
    key: "ipk",
    name: "IPK",
    weight: 0.35,
    type: "benefit",
  },
  {
    key: "penghasilan",
    name: "Penghasilan Orang Tua",
    weight: 0.30,
    type: "cost",
  },
  {
    key: "tanggungan",
    name: "Jumlah Tanggungan",
    weight: 0.20,
    type: "benefit",
  },
  {
    key: "jumlahSertifikasi",
    name: "Sertifikasi",
    weight: 0.15,
    type: "benefit",
  },
];

// ==========================================
// ELECTRE I
// ==========================================

function calculateElectre(
  students: Student[],
  criteria: Criterion[]
): ElectreResult[] {
  const n = students.length;
  const m = criteria.length;

  if (n === 0 || m === 0) return [];

  // 1. Matriks keputusan X
  const X = students.map((student) =>
    criteria.map((criterion) =>
      Number(student[criterion.key]) || 0
    )
  );

  // 2. Normalisasi matriks R
  const R = X.map((row, j) =>
    row.map((value, k) => {
      const denominator = Math.sqrt(
        X.reduce(
          (sum, item) => sum + item[k] ** 2,
          0
        )
      );

      return denominator === 0
        ? 0
        : value / denominator;
    })
  );

  // 3. Normalisasi bobot
  const totalWeight = criteria.reduce(
    (sum, criterion) => sum + criterion.weight,
    0
  );

  if (totalWeight <= 0) return [];

  const weights = criteria.map(
    (criterion) => criterion.weight / totalWeight
  );

  // 4. Matriks ternormalisasi terbobot V
  const V = R.map((row) =>
    row.map((value, k) => value * weights[k])
  );

  // 5. Matriks concordance dan discordance
  const C = Array.from(
    { length: n },
    () => Array(n).fill(0)
  );

  const D = Array.from(
    { length: n },
    () => Array(n).fill(0)
  );

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;

      let concordanceSum = 0;
      let discordanceMax = 0;
      let allDifferenceMax = 0;

      for (let k = 0; k < m; k++) {
        const diff = V[i][k] - V[j][k];

        const isBetter =
          criteria[k].type === "benefit"
            ? diff >= 0
            : diff <= 0;

        if (isBetter) {
          concordanceSum += weights[k];
        } else {
          discordanceMax = Math.max(
            discordanceMax,
            Math.abs(diff)
          );
        }

        allDifferenceMax = Math.max(
          allDifferenceMax,
          Math.abs(diff)
        );
      }

      C[i][j] = concordanceSum;

      D[i][j] =
        allDifferenceMax === 0
          ? 0
          : discordanceMax / allDifferenceMax;
    }
  }

  // 6. Ambang batas concordance dan discordance
  let concordanceTotal = 0;
  let discordanceTotal = 0;
  let pairCount = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        concordanceTotal += C[i][j];
        discordanceTotal += D[i][j];
        pairCount++;
      }
    }
  }

  const thresholdC =
    pairCount > 0
      ? concordanceTotal / pairCount
      : 0;

  const thresholdD =
    pairCount > 0
      ? discordanceTotal / pairCount
      : 1;

  // 7. Matriks dominan dan outranking
  const E = Array.from(
    { length: n },
    () => Array(n).fill(0)
  );

  const concordanceDominance = Array.from(
    { length: n },
    () => Array(n).fill(0)
  );

  const discordanceDominance = Array.from(
    { length: n },
    () => Array(n).fill(0)
  );

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;

      concordanceDominance[i][j] =
        C[i][j] >= thresholdC ? 1 : 0;

      discordanceDominance[i][j] =
        D[i][j] <= thresholdD ? 1 : 0;

      E[i][j] =
        concordanceDominance[i][j] *
        discordanceDominance[i][j];
    }
  }

  // 8. Perhitungan nilai net outranking
  const results: ElectreResult[] = students.map(
    (student, i) => {
      const outgoing = E[i].reduce(
        (sum: number, value: number) =>
          sum + value,
        0
      );

      const incoming = E.reduce(
        (sum: number, row: number[]) =>
          sum + row[i],
        0
      );

      return {
        student,
        score: outgoing - incoming,
        rank: 0,
        concordance: outgoing,
        discordance: incoming,
        selected: false,
      };
    }
  );

  // 9. Ranking berdasarkan net outranking
  results.sort((a, b) => b.score - a.score);

  results.forEach((result, index) => {
    result.rank = index + 1;
  });

  // Peringkat pertama menjadi rekomendasi utama.
  // Keputusan akhir tetap melalui persetujuan admin.
  if (results.length > 0) {
    results[0].selected = true;
  }

  return results;
}

// ==========================================
// KOMPONEN UTAMA
// ==========================================

export default function AdminDashboard() {
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [criteria, setCriteria] =
    useState<Criterion[]>(INITIAL_CRITERIA);

  const [results, setResults] = useState<ElectreResult[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [published, setPublished] = useState(false);

  // ==========================================
  // LOAD DATA PENDAFTAR
  // ==========================================

  const loadStudents = () => {
    try {
      const savedArray = localStorage.getItem(
        "scholarshipApplications"
      );

      const legacy = localStorage.getItem(
        "scholarshipApplication"
      );

      let data: Student[] = [];

      if (savedArray) {
        const parsed = JSON.parse(savedArray);

        if (Array.isArray(parsed)) {
          data = parsed;
        }
      }

      // Dukungan data lama
      if (data.length === 0 && legacy) {
        const oldData = JSON.parse(legacy);

        if (oldData.status === "TERKIRIM") {
          data = [
            {
              ...oldData,
              id: oldData.id || "legacy-1",
              name: oldData.name || "Mahasiswa",
            },
          ];
        }
      }

      setStudents(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // ==========================================
  // HITUNG ELECTRE
  // ==========================================

  const runElectre = () => {
    if (students.length < 2) {
      alert(
        "Minimal diperlukan 2 mahasiswa untuk menjalankan perhitungan ELECTRE."
      );
      return;
    }

    const totalWeight = criteria.reduce(
      (sum, item) => sum + item.weight,
      0
    );

    if (totalWeight <= 0) {
      alert("Total bobot harus lebih dari 0.");
      return;
    }

    const calculatedResults = calculateElectre(
      students,
      criteria
    );

    setResults(calculatedResults);
    setCalculated(true);
    setPublished(false);

    setActiveTab("ranking");
  };

  // ==========================================
  // UPDATE BOBOT DAN JENIS KRITERIA
  // ==========================================

  const updateCriterion = (
    index: number,
    field: "weight" | "type",
    value: number | "benefit" | "cost"
  ) => {
    const updated = [...criteria];

    if (field === "weight") {
      updated[index].weight = Math.max(
        0,
        Number(value)
      );
    } else {
      updated[index].type = value as "benefit" | "cost";
    }

    setCriteria(updated);
    setCalculated(false);
  };

  // ==========================================
  // PUBLIKASI HASIL
  // ==========================================

  const publishResults = () => {
    if (!calculated || results.length === 0) {
      alert("Silakan jalankan ELECTRE terlebih dahulu.");
      return;
    }

    const confirmed = window.confirm(
      "Apakah kamu yakin ingin memublikasikan hasil seleksi?"
    );

    if (!confirmed) return;

    try {
      const updatedStudents = students.map((student) => {
        const result = results.find(
          (item) => item.student.id === student.id
        );

        return {
          ...student,
          result: result?.selected
            ? "LOLOS"
            : "TIDAK_LOLOS",
          electreRank: result?.rank,
          electreScore: result?.score,
        };
      });

      localStorage.setItem(
        "scholarshipApplications",
        JSON.stringify(updatedStudents)
      );

      // Kompatibilitas dashboard student versi satu akun.
      if (updatedStudents.length === 1) {
        localStorage.setItem(
          "scholarshipApplication",
          JSON.stringify(updatedStudents[0])
        );
      }

      setStudents(updatedStudents);
      setPublished(true);

      alert("Hasil seleksi berhasil dipublikasikan!");
    } catch (error) {
      console.error("Gagal memublikasikan:", error);
      alert("Gagal menyimpan hasil seleksi.");
    }
  };

  // ==========================================
  // FILTER PENCARIAN
  // ==========================================

  const filteredStudents = students.filter((student) =>
    `${student.name || ""} ${student.nim || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ==========================================
  // STATISTIK
  // ==========================================

  const totalStudents = students.length;

  const totalPublished = students.filter(
    (student) =>
      student.result === "LOLOS" ||
      student.result === "TIDAK_LOLOS"
  ).length;

  const totalPending = students.filter(
    (student) => student.result === "PENDING"
  ).length;

  const totalPassed = students.filter(
    (student) => student.result === "LOLOS"
  ).length;

  // ==========================================
  // FORMAT RUPIAH
  // ==========================================

  const rupiah = (value: string) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  // ==========================================
  // SIDEBAR MENU
  // ==========================================

  const menu = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "students",
      name: "Data Pendaftar",
      icon: Users,
    },
    {
      id: "criteria",
      name: "Kelola Kriteria",
      icon: Settings,
    },
    {
      id: "ranking",
      name: "Hasil ELECTRE",
      icon: Trophy,
    },
  ];

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="min-h-screen bg-[#F8FAFC] relative">

      {/* BACKGROUND BLUR */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-300/30 blur-[130px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-200/40 blur-[130px] rounded-full" />
      </div>

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#172554] p-6 z-30 hidden md:flex flex-col">

        <div className="flex items-center gap-3 mb-12">
          <div className="bg-[#2563EB] p-2 rounded-xl text-white">
            <Trophy size={25} />
          </div>

          <div>
            <h1 className="font-bold text-xl text-white">
              SINERGI
            </h1>
            <p className="text-xs text-blue-300">
              Admin Panel
            </p>
          </div>
        </div>

        <p className="text-xs font-bold text-blue-300 mb-4">
          MENU ADMIN
        </p>

        <div className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  activeTab === item.id
                    ? "bg-[#2563EB] text-white"
                    : "text-blue-100 hover:bg-white/10"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </button>
            );
          })}
        </div>

        <div className="mt-auto">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-3 text-red-300 px-4 py-3 hover:bg-white/10 rounded-xl w-full"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>

      </aside>

      {/* MAIN */}

      <div className="md:ml-64 relative z-10">

        {/* TOPBAR */}

        <header className="sticky top-0 bg-white/70 backdrop-blur-xl border-b border-white px-6 py-5 flex justify-between items-center z-20">

          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">
              {menu.find((item) => item.id === activeTab)?.name}
            </h2>

            <p className="text-sm text-[#64748B]">
              Sistem Informasi Penerimaan Beasiswa Terintegrasi
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#0F172A]">
                Administrator
              </p>
              <p className="text-xs text-[#64748B]">
                Admin
              </p>
            </div>

            <div className="bg-[#172554] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
              A
            </div>
          </div>

        </header>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">

          {/* ================================= */}
          {/* DASHBOARD */}
          {/* ================================= */}

          {activeTab === "dashboard" && (

            <div className="space-y-8">

              <div>
                <h1 className="text-3xl font-bold text-[#0F172A]">
                  Selamat Datang, Admin!
                </h1>

                <p className="text-[#64748B] mt-2">
                  Pantau pendaftaran dan proses seleksi beasiswa.
                </p>
              </div>

              {/* STATISTIK */}

              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

                {[
                  {
                    title: "Total Pendaftar",
                    value: totalStudents,
                    icon: Users,
                    color: "text-blue-600",
                    bg: "bg-blue-100",
                  },
                  {
                    title: "Sudah Diumumkan",
                    value: totalPublished,
                    icon: CheckCircle2,
                    color: "text-green-600",
                    bg: "bg-green-100",
                  },
                  {
                    title: "Menunggu Hasil",
                    value: totalPending,
                    icon: Clock,
                    color: "text-amber-600",
                    bg: "bg-amber-100",
                  },
                  {
                    title: "Mahasiswa Lolos",
                    value: totalPassed,
                    icon: Trophy,
                    color: "text-purple-600",
                    bg: "bg-purple-100",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-5 shadow-lg shadow-blue-900/5"
                    >
                      <div className={`w-11 h-11 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon size={23} />
                      </div>

                      <p className="text-sm text-[#64748B]">
                        {item.title}
                      </p>

                      <h3 className="text-3xl font-bold text-[#0F172A] mt-1">
                        {item.value}
                      </h3>
                    </div>
                  );
                })}

              </div>

              {/* AKSI */}

              <div className="bg-gradient-to-br from-[#172554] to-[#2563EB] rounded-2xl p-7 text-white shadow-xl">

                <div className="flex flex-col md:flex-row justify-between gap-5 items-center">

                  <div>
                    <h3 className="text-xl font-bold">
                      Mulai Proses Seleksi ELECTRE
                    </h3>

                    <p className="text-blue-100 text-sm mt-2">
                      Hitung dan urutkan mahasiswa berdasarkan kriteria beasiswa.
                    </p>
                  </div>

                  <button
                    onClick={runElectre}
                    className="bg-white text-[#2563EB] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition flex items-center gap-2"
                  >
                    <Calculator size={20} />
                    Jalankan ELECTRE
                  </button>

                </div>

              </div>

              {/* PENDAFTAR TERBARU */}

              <section className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-6 shadow-lg">

                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-lg text-[#0F172A]">
                    Pendaftar Terbaru
                  </h3>

                  <button
                    onClick={() => setActiveTab("students")}
                    className="text-sm text-[#2563EB] font-semibold"
                  >
                    Lihat Semua
                  </button>
                </div>

                {students.length === 0 ? (
                  <p className="text-center text-[#64748B] py-10">
                    Belum ada mahasiswa yang mendaftar.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[#64748B] border-b">
                        <tr>
                          <th className="py-3">Nama</th>
                          <th>NIM</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {students.slice(0, 5).map((student) => (
                          <tr
                            key={student.id}
                            className="border-b border-slate-100"
                          >
                            <td className="py-4 font-semibold text-[#0F172A]">
                              {student.name || "Mahasiswa"}
                            </td>

                            <td className="text-[#64748B]">
                              {student.nim || "-"}
                            </td>

                            <td>
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                Terkirim
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </section>

            </div>
          )}

          {/* ================================= */}
          {/* DATA PENDAFTAR */}
          {/* ================================= */}

          {activeTab === "students" && (

            <section className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-6 shadow-lg">

              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">

                <div>
                  <h3 className="font-bold text-xl text-[#0F172A]">
                    Data Pendaftar Beasiswa
                  </h3>

                  <p className="text-sm text-[#64748B] mt-1">
                    Total {students.length} mahasiswa terdaftar.
                  </p>
                </div>

                <button
                  onClick={loadStudents}
                  className="flex items-center justify-center gap-2 border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm font-semibold text-[#2563EB]"
                >
                  <RefreshCw size={17} />
                  Refresh Data
                </button>

              </div>

              <div className="relative mb-5">
                <Search
                  className="absolute left-4 top-3 text-slate-400"
                  size={19}
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama atau NIM mahasiswa..."
                  className="w-full pl-11 pr-4 py-3 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="overflow-x-auto">

                <table className="w-full text-sm text-left">

                  <thead className="bg-blue-50 text-[#172554]">
                    <tr>
                      <th className="p-4">No</th>
                      <th className="p-4">Nama Mahasiswa</th>
                      <th className="p-4">NIM</th>
                      <th className="p-4">IPK</th>
                      <th className="p-4">Penghasilan</th>
                      <th className="p-4">Tanggungan</th>
                      <th className="p-4">Sertifikasi</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <tr
                        key={student.id}
                        className="border-b border-slate-100 hover:bg-blue-50/50"
                      >
                        <td className="p-4">
                          {index + 1}
                        </td>

                        <td className="p-4 font-semibold text-[#0F172A]">
                          {student.name || "Mahasiswa"}
                        </td>

                        <td className="p-4">
                          {student.nim || "-"}
                        </td>

                        <td className="p-4">
                          {student.ipk}
                        </td>

                        <td className="p-4">
                          {rupiah(student.penghasilan)}
                        </td>

                        <td className="p-4">
                          {student.tanggungan}
                        </td>

                        <td className="p-4">
                          {student.jumlahSertifikasi}
                        </td>

                        <td className="p-4">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredStudents.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center p-10 text-[#64748B]"
                        >
                          Data mahasiswa tidak ditemukan.
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </section>
          )}

          {/* ================================= */}
          {/* KELOLA KRITERIA */}
          {/* ================================= */}

          {activeTab === "criteria" && (

            <section className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-6 shadow-lg">

              <div className="mb-6">
                <h3 className="font-bold text-xl text-[#0F172A]">
                  Kelola Kriteria ELECTRE
                </h3>

                <p className="text-sm text-[#64748B] mt-1">
                  Atur bobot dan jenis kriteria untuk seleksi beasiswa.
                </p>
              </div>

              <div className="overflow-x-auto">

                <table className="w-full text-sm text-left">

                  <thead className="bg-blue-50 text-[#172554]">
                    <tr>
                      <th className="p-4">Kriteria</th>
                      <th className="p-4">Bobot</th>
                      <th className="p-4">Jenis</th>
                    </tr>
                  </thead>

                  <tbody>
                    {criteria.map((criterion, index) => (
                      <tr
                        key={criterion.key}
                        className="border-b border-slate-100"
                      >
                        <td className="p-4 font-semibold text-[#0F172A]">
                          {criterion.name}
                        </td>

                        <td className="p-4">
                          <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.05"
                            value={criterion.weight}
                            onChange={(e) =>
                              updateCriterion(
                                index,
                                "weight",
                                Number(e.target.value)
                              )
                            }
                            className="w-24 border border-[#E2E8F0] rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>

                        <td className="p-4">
                          <select
                            value={criterion.type}
                            onChange={(e) =>
                              updateCriterion(
                                index,
                                "type",
                                e.target.value as "benefit" | "cost"
                              )
                            }
                            className="border border-[#E2E8F0] rounded-lg p-2 outline-none"
                          >
                            <option value="benefit">
                              Benefit
                            </option>

                            <option value="cost">
                              Cost
                            </option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

              <div className="mt-5 bg-blue-50 rounded-xl p-4">

                <p className="text-sm font-semibold text-[#172554]">
                  Total Bobot
                </p>

                <p className="text-2xl font-bold text-[#2563EB] mt-1">
                  {criteria.reduce(
                    (sum, item) => sum + item.weight,
                    0
                  ).toFixed(2)}
                </p>

                <p className="text-xs text-[#64748B] mt-2">
                  Bobot akan dinormalisasi otomatis saat proses perhitungan.
                  Nilai bobot awal disediakan sebagai contoh dan dapat disesuaikan.
                </p>

              </div>

              <button
                onClick={runElectre}
                className="mt-6 bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              >
                <Calculator size={19} />
                Hitung dengan Bobot Ini
              </button>

            </section>
          )}

          {/* ================================= */}
          {/* HASIL ELECTRE */}
          {/* ================================= */}

          {activeTab === "ranking" && (

            <div className="space-y-6">

              <section className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-6 shadow-lg">

                <div className="flex flex-col md:flex-row justify-between gap-4">

                  <div>
                    <h3 className="font-bold text-xl text-[#0F172A]">
                      Ranking Hasil ELECTRE
                    </h3>

                    <p className="text-sm text-[#64748B] mt-1">
                      Urutan alternatif berdasarkan nilai net outranking.
                    </p>
                  </div>

                  <button
                    onClick={runElectre}
                    className="bg-[#2563EB] text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
                  >
                    <RefreshCw size={18} />
                    Hitung Ulang
                  </button>

                </div>

                {!calculated ? (

                  <div className="text-center py-16">

                    <Calculator
                      size={45}
                      className="mx-auto text-slate-300 mb-4"
                    />

                    <h4 className="font-bold text-[#0F172A]">
                      Belum Ada Hasil Perhitungan
                    </h4>

                    <p className="text-sm text-[#64748B] mt-2">
                      Klik Hitung Ulang untuk menjalankan metode ELECTRE.
                    </p>

                  </div>

                ) : (

                  <div className="overflow-x-auto mt-6">

                    <table className="w-full text-sm text-left">

                      <thead className="bg-blue-50 text-[#172554]">
                        <tr>
                          <th className="p-4">Ranking</th>
                          <th className="p-4">Nama Mahasiswa</th>
                          <th className="p-4">NIM</th>
                          <th className="p-4">Concordance</th>
                          <th className="p-4">Discordance</th>
                          <th className="p-4">Net Score</th>
                          <th className="p-4">Rekomendasi</th>
                        </tr>
                      </thead>

                      <tbody>

                        {results.map((item) => (

                          <tr
                            key={item.student.id}
                            className="border-b border-slate-100"
                          >

                            <td className="p-4">
                              <span className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                                item.rank === 1
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}>
                                {item.rank}
                              </span>
                            </td>

                            <td className="p-4 font-semibold text-[#0F172A]">
                              {item.student.name || "Mahasiswa"}
                            </td>

                            <td className="p-4">
                              {item.student.nim || "-"}
                            </td>

                            <td className="p-4">
                              {item.concordance}
                            </td>

                            <td className="p-4">
                              {item.discordance}
                            </td>

                            <td className="p-4 font-bold text-[#2563EB]">
                              {item.score}
                            </td>

                            <td className="p-4">
                              {item.selected ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                  Prioritas 1
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">
                                  Alternatif
                                </span>
                              )}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                )}

              </section>

              {/* PUBLIKASI */}

              {calculated && (

                <section className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-6 shadow-lg">

                  <h3 className="font-bold text-lg text-[#0F172A]">
                    Publikasi Hasil Seleksi
                  </h3>

                  <p className="text-sm text-[#64748B] mt-2">
                    Setelah diperiksa, admin dapat memublikasikan hasil seleksi agar status mahasiswa diperbarui.
                  </p>

                  <button
                    onClick={publishResults}
                    disabled={published}
                    className={`mt-5 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 ${
                      published
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-[#2563EB] hover:bg-blue-700 text-white"
                    }`}
                  >
                    {published ? (
                      <>
                        <CheckCircle2 size={19} />
                        Hasil Sudah Dipublikasikan
                      </>
                    ) : (
                      <>
                        <Award size={19} />
                        Publikasikan Hasil
                      </>
                    )}
                  </button>

                </section>

              )}

            </div>
          )}

        </div>

      </div>

    </main>
  );
}
