import { useState } from "react";
import { MapPin, ChevronLeft, Loader2 } from "lucide-react";
import { getIpLocation } from "../ui/utils";

type LocationPermissionScreenProps = {
  onLocationGranted: (location: { lat: number; lng: number }) => void;
  onBack: () => void;
};

export function LocationPermissionScreen({
  onLocationGranted,
  onBack,
}: LocationPermissionScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetLocation = () => {
    setIsLoading(true);
    setError("");
    console.log("Requesting location...");

    const handleSuccess = (lat: number, lng: number) => {
      setIsLoading(false);
      onLocationGranted({ lat, lng });
    };

    const handleFallback = async () => {
      console.log("Attempting IP fallback...");
      const ipLoc = await getIpLocation();
      if (ipLoc) {
        console.log("IP Location received:", ipLoc);
        handleSuccess(ipLoc.lat, ipLoc.lng);
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
        handleSuccess(position.coords.latitude, position.coords.longitude);
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
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-8">
            <MapPin className="w-16 h-16 text-blue-600" />
          </div>

          <h2 className="mb-4 text-center">Enable Location Access</h2>
          <p className="text-gray-600 text-center mb-8 px-4">
            We need your location to deliver medicines to your doorstep
          </p>

          {error && (
            <p className="text-red-500 text-center mb-6 bg-red-50 p-3 rounded-lg w-full">
              {error}
            </p>
          )}

          <button
            onClick={handleGetLocation}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>📍 Enable Location Access</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
