import { useState } from "react";
import axios from "axios"; // If using axios
import { API_BASE_URL } from "../../api";
import { ChevronLeft, MoreVertical, Bike, Building2, Pill } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type SignInScreenProps = {
  onContinue: (customer: any) => void; // Update to handle the customer data
  onBack: () => void;
  onSwitchRole?: (role: "rider" | "pharmacy") => void;
};

export function SignInScreen({
  onContinue,
  onBack,
  onSwitchRole,
}: SignInScreenProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleContinue = async () => {
    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/signin`, {
        phone,
        name,
      });

      // Pass the customer data to the parent component
      onContinue(response.data);
      alert("Sign-in successful!");
    } catch (err) {
      console.error("Sign-in failed:", err);
      setError("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="p-6 relative z-10 text-white">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            {!onSwitchRole && (
              <button onClick={onBack} className="mr-1">
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight flex">
              <span className="text-blue-400">M</span>
              <span className="text-green-400">e</span>
              <span className="text-yellow-400">d</span>
              <span className="text-red-400">i</span>
              <span className="text-white">D</span>
              <span className="text-purple-400">e</span>
              <span className="text-pink-400">l</span>
              <span className="text-orange-400">i</span>
              <span className="text-teal-400">v</span>
              <span className="text-cyan-400">e</span>
              <span className="text-lime-400">r</span>
            </h1>
          </div>

          {onSwitchRole && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-blue-500 rounded-full transition-colors">
                  <MoreVertical className="w-6 h-6 text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 border-2 border-gray-200 shadow-xl"
              >
                <DropdownMenuItem
                  onClick={() => onSwitchRole("rider")}
                  className="cursor-pointer"
                >
                  <Bike className="mr-2 h-4 w-4" />
                  <span>Rider Login</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSwitchRole("pharmacy")}
                  className="cursor-pointer"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Pharmacy Login</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <h2 className="text-3xl font-bold mb-2">Welcome</h2>
        <p className="text-blue-100 mb-12">Sign in to order medicines</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-6">
          <div>
            <label className="block mb-3 text-lg font-medium text-white">
              Phone Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full bg-white border-2 border-transparent rounded-xl px-6 py-4 text-gray-900 text-lg placeholder:text-gray-400 focus:outline-none focus:border-blue-500 shadow-lg"
            />
          </div>

          <div>
            <label className="block mb-3 text-lg font-medium text-white">
              Name (Optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-white border-2 border-transparent rounded-xl px-6 py-4 text-gray-900 text-lg placeholder:text-gray-400 focus:outline-none focus:border-blue-500 shadow-lg"
            />
          </div>

          <button
            onClick={handleContinue}
            disabled={!phone.trim()}
            className="w-full bg-white text-blue-600 py-5 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-12"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
