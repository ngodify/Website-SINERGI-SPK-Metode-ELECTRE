
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

type AuthPageProps = {
  initialMode?: "login" | "signup";
};

export default function AuthPage({
  initialMode = "login",
}: AuthPageProps) {
  const [isSignup, setIsSignup] = useState(
    initialMode === "signup"
  );

  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (isSignup) {
      // REGISTRASI MAHASISWA
      const name = formData.get("name") as string;
      const nim = formData.get("nim") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");

      if (password !== confirmPassword) {
        alert("Password dan konfirmasi password tidak sama!");
        return;
      }

      // Simpan data mahasiswa sementara
      localStorage.setItem("studentName", name);
      localStorage.setItem("studentNim", nim);
      localStorage.setItem("studentEmail", email);
      localStorage.setItem("studentId", nim);
      localStorage.setItem("userRole", "student");

      alert("Registrasi berhasil! Silakan lengkapi formulir beasiswa.");

      router.push("/apply");
      return;
    }

    // LOGIN
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // LOGIN ADMIN
    const adminEmail = "admin@sinergi.ac.id";
    const adminPassword = "admin123";

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("userRole", "admin");

      alert("Login admin berhasil!");

      router.push("/admin");
      return;
    }

    // LOGIN MAHASISWA
    if (email === adminEmail && password !== adminPassword) {
      alert("Password admin salah!");
      return;
    }

    localStorage.setItem("studentEmail", email);
    localStorage.setItem("userRole", "student");

    alert("Login berhasil!");

    router.push("/student");
  };

  return (
    <main className="auth-background min-h-screen flex items-center justify-center p-5">
      <div
        className={`auth-container ${
          isSignup ? "signup-mode" : ""
        }`}
      >
        {/* FORM PANEL */}
        <section className="auth-form-panel">
          <div className="w-full max-w-sm mx-auto">

            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <GraduationCap size={25} />
              </div>

              <span className="font-bold text-xl text-[#172554]">
                SINERGI
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-bold text-[#0F172A]">
              {isSignup ? "Buat Akun" : "Selamat Datang!"}
            </h1>

            <p className="text-[#64748B] mt-2 mb-7">
              {isSignup
                ? "Daftarkan dirimu dan mulai perjalanan beasiswamu."
                : "Masuk untuk melanjutkan proses seleksi beasiswa."}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Nama Lengkap */}
              {isSignup && (
                <div className="auth-input-wrapper">
                  <User size={19} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama lengkap"
                    required
                  />
                </div>
              )}

              {/* NIM */}
              {isSignup && (
                <div className="auth-input-wrapper">
                  <GraduationCap size={19} />
                  <input
                    type="text"
                    name="nim"
                    placeholder="NIM"
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div className="auth-input-wrapper">
                <Mail size={19} />
                <input
                  type="email"
                  name="email"
                  placeholder="Alamat email"
                  required
                />
              </div>

              {/* Password */}
              <div className="auth-input-wrapper">
                <Lock size={19} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  minLength={8}
                />
              </div>

              {/* Konfirmasi Password */}
              {isSignup && (
                <div className="auth-input-wrapper">
                  <Lock size={19} />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Konfirmasi password"
                    required
                    minLength={8}
                  />
                </div>
              )}

              {/* Forgot Password */}
              {!isSignup && (
                <div className="text-right">
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Lupa password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="auth-button"
              >
                {isSignup ? "Daftar Sekarang" : "Login"}
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Toggle Login / Register */}
            <p className="text-center text-sm text-[#64748B] mt-6">
              {isSignup
                ? "Sudah punya akun?"
                : "Belum punya akun?"}{" "}

              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="font-semibold text-blue-600 hover:underline"
              >
                {isSignup ? "Login" : "Sign Up"}
              </button>
            </p>

          </div>
        </section>

        {/* WELCOME PANEL */}
        <section className="auth-welcome-panel">
          <div className="welcome-content">

            <div className="welcome-icon">
              <GraduationCap size={42} />
            </div>

            <h2>
              {isSignup
                ? "Selamat Datang!"
                : "Raih Masa Depanmu!"}
            </h2>

            <p>
              {isSignup
                ? "Bergabunglah dan temukan kesempatan beasiswa yang sesuai dengan potensimu."
                : "Satu langkah lebih dekat menuju kesempatan pendidikan dan masa depan yang lebih baik."}
            </p>

            <div className="welcome-dots">
              <span />
              <span />
              <span />
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
