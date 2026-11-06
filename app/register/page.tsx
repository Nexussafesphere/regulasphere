"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Building2,
  Users,
  Landmark,
  User,
} from "lucide-react";
import { registerUser, type UserType } from "@/lib/auth";

const USER_TYPES = [
  {
    value: "Business" as UserType,
    label: "Business",
    description: "Track compliance",
    icon: Building2,
  },
  {
    value: "Consultant" as UserType,
    label: "Consultant",
    description: "Verify documents",
    icon: Users,
  },
  {
    value: "Regulator" as UserType,
    label: "Regulator",
    description: "Monitor",
    icon: Landmark,
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>("Business");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await registerUser({
        full_name: fullName,
        email,
        password,
        user_type: userType,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push("/onboarding");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-start justify-center bg-[#2C3210] relative isolate overflow-hidden py-8 sm:py-10 px-3 sm:px-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #D4AF37 1px, transparent 1px), radial-gradient(circle at 75% 75%, #D4AF37 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto gold-gradient rounded-2xl flex items-center justify-center shadow-2xl mb-4">
            <Shield className="w-8 h-8 text-[#2C3210]" />
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-[#D4C5A9] text-sm">Join RegulaSphere and stay compliant</p>
        </div>

        {/* Card */}
        <div className="auth-card relative z-10">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="auth-form">
            {/* User Type Selection - 3 cards */}
            <div>
              <label className="block text-sm font-semibold text-[#2C3210] mb-2">
                I am a
              </label>
              <div className="auth-role-grid">
                {USER_TYPES.map((type) => {
                  const Icon = type.icon;
                  const selected = userType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setUserType(type.value)}
                      className={`auth-role-card transition-all ${
                        selected
                          ? "border-[#4B5320] bg-[#4B5320]/5"
                          : "border-gray-200 hover:border-[#4B5320]/50"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mx-auto mb-1 ${
                          selected ? "text-[#4B5320]" : "text-gray-400"
                        }`}
                      />
                      <p className={`text-xs font-semibold ${selected ? "text-[#4B5320]" : "text-gray-600"}`}>
                        {type.label}
                      </p>
                      <p className="text-[9px] text-gray-400 truncate">
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#2C3210] mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                    className="input input-with-leading-icon relative z-0 w-full pr-4"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#2C3210] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                    className="input input-with-leading-icon relative z-0 w-full pr-4"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#2C3210] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    className="input input-with-leading-icon input-with-trailing-icon relative z-0 w-full"
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-gray-400 hover:text-[#2C3210] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4B5320] text-white font-bold py-3.5 rounded-xl text-base hover:bg-[#3B4218] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-[#4B5320] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}