import React from "react";
import { RegisterForm } from "../features/auth/RegisterForm";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export const RegisterPage = () => {
  return (
    <div className="min-h-screen flex w-full bg-[var(--surface)] text-[var(--text)]">
      {/* Brand Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col flex-1 bg-teal-950 p-12 justify-between relative overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[80%] h-[80%] opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle at top right, rgba(20,184,166,0.3) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle at bottom left, rgba(20,184,166,0.15) 0%, transparent 50%)" }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-500 shadow-lg shadow-teal-500/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">GigFlow</span>
        </div>

        <div className="relative z-10 max-w-lg pb-12">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Start closing more deals today.
          </h2>
          <p className="text-teal-200/80 text-lg">
            Join the smartest sales teams using GigFlow to automate lead tracking, manage pipelines, and accelerate growth.
          </p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        {/* Mobile Header */}
        <div className="flex lg:hidden items-center gap-3 mb-12">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent)] shadow-sm">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">GigFlow</span>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
            <p className="text-sm text-[var(--text-muted)]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[var(--accent)] hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};
