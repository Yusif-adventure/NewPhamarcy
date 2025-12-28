import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { ChevronLeft } from "lucide-react";

type SignUpScreenProps = {
  role: "pharmacy" | "rider";
  onBack: () => void;
  onSignUpSuccess: () => void;
};

export function SignUpScreen({
  role,
  onBack,
  onSignUpSuccess,
}: SignUpScreenProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async () => {
    if (!name.trim() || !phone.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      // Use the full URL for the backend
      await axios.post(`${API_BASE_URL}/signup`, {
        role,
        name,
        phone,
        password,
      });

      setSuccess("Sign-up successful! You can now log in.");
      setError("");
      // Optional: Automatically redirect to login after a delay
      setTimeout(() => {
        onSignUpSuccess();
      }, 2000);
    } catch (err) {
      console.error("Sign-up failed:", err);
      setError("Failed to sign up. Please try again.");
    }
  };

  const bgImage =
    role === "pharmacy"
      ? "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2000&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2000&auto=format&fit=crop";

  const buttonColor =
    role === "pharmacy"
      ? "bg-green-500 hover:bg-green-600"
      : "bg-purple-600 hover:bg-purple-700";

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="p-6 relative z-10">
        <button onClick={onBack} className="mb-8">
          <ChevronLeft className="w-8 h-8" />
        </button>

        <h1 className="mb-2 text-3xl font-bold">Sign Up</h1>
        <p className="text-gray-200 mb-12">
          {role === "pharmacy" ? "Sign up as a Pharmacy" : "Sign up as a Rider"}
        </p>

        {error && (
          <p className="text-red-500 mb-4 bg-white/90 p-2 rounded font-medium">{error}</p>
        )}
        {success && (
          <p className="text-white mb-4 bg-green-500/80 p-2 rounded font-medium">
            {success}
          </p>
        )}

        <div className="space-y-6">
          <div>
            <label className="block mb-3 text-sm text-gray-200">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-white backdrop-blur-sm"
            />
          </div>

          <div>
            <label className="block mb-3 text-sm text-gray-200">
              Phone Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-white backdrop-blur-sm"
            />
          </div>

          <div>
            <label className="block mb-3 text-sm text-gray-200">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-white backdrop-blur-sm"
            />
          </div>

          <button
            onClick={handleSignUp}
            disabled={!name.trim() || !phone.trim() || !password.trim()}
            className={`w-full ${buttonColor} text-white py-5 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-12 font-bold text-lg active:scale-95 active:brightness-90`}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
