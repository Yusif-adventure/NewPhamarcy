import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { ChevronLeft } from "lucide-react";

type RiderLoginScreenProps = {
  onContinue: (name: string, phone: string, vehicleType: string) => void;
  onSignUp: () => void;
  onBack: () => void;
};

export function RiderLoginScreen({
  onContinue,
  onSignUp,
  onBack,
}: RiderLoginScreenProps) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      setError("Phone number and password are required");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        role: "rider",
        phone,
        password,
      });

      const { name, phone: userPhone, vehicleType } = response.data.data;
      onContinue(name, userPhone, vehicleType || "motorcycle");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2000&auto=format&fit=crop")',
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

        <h1 className="mb-2 text-3xl font-bold">🛵 Rider Login</h1>
        <p className="text-gray-200 mb-12">Access your rider dashboard</p>

        {error && (
          <p className="text-red-500 mb-4 bg-white/90 p-2 rounded font-medium">
            {error}
          </p>
        )}

        <div className="space-y-6">
          <div>
            <label className="block mb-3 text-sm text-gray-200">
              Phone Number
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
            <label className="block mb-3 text-sm text-gray-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-white backdrop-blur-sm"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={!phone.trim() || !password.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-5 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-12 font-bold text-lg active:scale-95 active:bg-purple-800"
          >
            Login
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-200">
              Don't have an account?{" "}
              <button
                onClick={onSignUp}
                className="text-white font-bold underline hover:text-purple-400 transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
