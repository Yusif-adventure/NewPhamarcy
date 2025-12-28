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

  const bgColor = role === "pharmacy" ? "bg-green-600" : "bg-purple-600";
  const textColor = role === "pharmacy" ? "text-green-100" : "text-purple-100";
  const placeholderColor =
    role === "pharmacy"
      ? "placeholder:text-green-200"
      : "placeholder:text-purple-200";

  return (
    <div className={`min-h-screen ${bgColor} text-white`}>
      <div className="p-6">
        <button onClick={onBack} className="mb-8">
          <ChevronLeft className="w-8 h-8" />
        </button>

        <h1 className="mb-2">Sign Up</h1>
        <p className={`${textColor} mb-12`}>
          {role === "pharmacy" ? "Sign up as a Pharmacy" : "Sign up as a Rider"}
        </p>

        {error && (
          <p className="text-red-500 mb-4 bg-white/80 p-2 rounded">{error}</p>
        )}
        {success && (
          <p className="text-white mb-4 bg-green-500/50 p-2 rounded">
            {success}
          </p>
        )}

        <div className="space-y-6">
          <div>
            <label className={`block mb-3 text-sm ${textColor}`}>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={`w-full bg-white/10 border-2 border-white/30 rounded-xl px-6 py-4 text-white ${placeholderColor} focus:outline-none focus:border-white`}
            />
          </div>

          <div>
            <label className={`block mb-3 text-sm ${textColor}`}>
              Phone Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className={`w-full bg-white/10 border-2 border-white/30 rounded-xl px-6 py-4 text-white ${placeholderColor} focus:outline-none focus:border-white`}
            />
          </div>

          <div>
            <label className={`block mb-3 text-sm ${textColor}`}>
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`w-full bg-white/10 border-2 border-white/30 rounded-xl px-6 py-4 text-white ${placeholderColor} focus:outline-none focus:border-white`}
            />
          </div>

          <button
            onClick={handleSignUp}
            className={`w-full bg-white ${
              role === "pharmacy" ? "text-green-600" : "text-purple-600"
            } py-5 px-6 rounded-xl shadow-lg transition-all mt-12 font-bold`}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
