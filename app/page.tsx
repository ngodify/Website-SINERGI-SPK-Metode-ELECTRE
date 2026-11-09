
"use client";

import { useState } from "react";
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

  return (
    <main className="auth-background min-h-screen flex items-center justify-center p-5">
      <div
        className={`auth-container ${
          isSignup ? "signup-mode" : ""
        }`}
      >
        {/* FORM LOGIN */}
        <section className="auth-form-panel">
          <div className="w-full max-w-sm mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <GraduationCap size={25} />
              </div>
              <span className="font-bold text-xl text-[#172554]">
                SINERGI
              </span>
            </div>

            <h1 className="text-3xl font-bold text-[#0F172A]">
              {isSignup ? "Buat Akun" : "Selamat Datang!"}
            </h1>

            <p className="text-[#64748B] mt-2 mb-7">
              {isSignup
                ? "Daftarkan dirimu dan mulai perjalanan beasiswamu."
                : "Masuk untuk melanjutkan proses seleksi beasiswa."}
            </p>

            <form className="space-y-4">
              {isSignup && (
                <div className="auth-input-wrapper">
                  <User size={19} />
                  <input
                    type="text"
                    placeholder="Nama lengkap"
                    required
                  />
                </div>
              )}

              {isSignup && (
                <div className="auth-input-wrapper">
                  <GraduationCap size={19} />
                  <input
                    type="text"
                    placeholder="NIM"
                    required
                  />
                </div>
              )}

              <div className="auth-input-wrapper">
                <Mail size={19} />
                <input
                  type="email"
                  placeholder="Alamat email"
                  required
                />
              </div>

              <div className="auth-input-wrapper">
                <Lock size={19} />
                <input
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>

              {isSignup && (
                <div className="auth-input-wrapper">
                  <Lock size={19} />
                  <input
                    type="password"
                    placeholder="Konfirmasi password"
                    required
                  />
                </div>
              )}

              {!isSignup && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Lupa password?
                  </button>
                </div>
              )}

              <button type="submit" className="auth-button">
                {isSignup ? "Daftar Sekarang" : "Login"}
                <ArrowRight size={18} />
              </button>
            </form>

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
