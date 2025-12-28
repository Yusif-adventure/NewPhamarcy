import { useState } from "react";
import { ChevronLeft, MapPin, Loader2 } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { getIpLocation } from "../ui/utils";

type RiderLocationPermissionScreenProps = {
  onLocationGranted: (location: { lat: number; lng: number }) => void;
  onBack: () => void;
  phone: string;
};

export function RiderLocationPermissionScreen({
  onLocationGranted,
  onBack,
  phone,
}: RiderLocationPermissionScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEnableLocation = () => {
    setIsLoading(true);
    setError("");
    console.log("Requesting location...");

    const saveLocation = async (lat: number, lng: number) => {
      try {
        // Save location to backend
        await axios.post(`${API_BASE_URL}/user/update-location`, {
          role: "rider",
          phone: phone,
          lat: lat,
          lng: lng,
        });

        setIsLoading(false);
        onLocationGranted({
          lat: lat,
          lng: lng,
        });
      } catch (err) {
        console.error("Error saving location:", err);
        setIsLoading(false);
        setError("Failed to save location. Please try again.");
      }
    };

    const handleFallback = async () => {
      console.log("Attempting IP fallback...");
      const ipLoc = await getIpLocation();
      if (ipLoc) {
        console.log("IP Location received:", ipLoc);
        saveLocation(ipLoc.lat, ipLoc.lng);
      } else {
        setIsLoading(false);
        setError("Unable to retrieve your location. Please enable location services.");
      }
    };

    if (!navigator.geolocation) {
      handleFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Location received:", position);
        saveLocation(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.error("Error getting location:", err);
        handleFallback();
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        <button onClick={onBack} className="mb-8">
          <ChevronLeft className="w-8 h-8 text-gray-700" />
        </button>

        <div className="flex flex-col items-center justify-center mt-24">
          <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-8">
            <MapPin className="w-16 h-16 text-purple-600" />
          </div>

          <h2 className="mb-4 text-center">Enable Rider Location</h2>
          <p className="text-gray-600 text-center mb-8 px-4">
            We need your location to show you nearby delivery requests
          </p>

          {error && (
            <p className="text-red-500 text-center mb-6 bg-red-50 p-3 rounded-lg w-full">
              {error}
            </p>
          )}

          <button
            onClick={handleEnableLocation}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isLoading ? "Saving Location..." : "Getting Location..."}
              </>
            ) : (
              <>📍 Enable Rider Location</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
