import { useState, useEffect } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../api";

type Pharmacy = {
  id: string;
  name: string;
  phone: string;
  latitude: number;
  longitude: number;
  address?: string;
};

type PharmacyCardProps = {
  name: string;
  distance: string;
  isOpen: boolean;
  onView: () => void;
};

function PharmacyCard({ name, distance, isOpen, onView }: PharmacyCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="mb-2">{name}</h3>
          <p className="text-gray-600">{distance}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isOpen ? "● Open" : "● Closed"}
        </span>
      </div>

      <button
        onClick={onView}
        className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl"
      >
        View Pharmacy
      </button>
    </div>
  );
}

type AvailablePharmaciesScreenProps = {
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
  onBack: () => void;
  userLocation?: { lat: number; lng: number };
};

export function AvailablePharmaciesScreen({
  onSelectPharmacy,
  onBack,
  userLocation,
}: AvailablePharmaciesScreenProps) {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/pharmacies`);
        console.log("Fetched pharmacies:", response.data);
        setPharmacies(response.data);
      } catch (err) {
        console.error("Error fetching pharmacies:", err);
        setError("Failed to load pharmacies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPharmacies();
  }, []);

  console.log("User Location:", userLocation);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <button onClick={onBack} className="mb-8">
          <ChevronLeft className="w-8 h-8 text-gray-700" />
        </button>

        <h1 className="mb-2">Available Pharmacies</h1>
        <p className="text-gray-600 mb-8">
          Nearby pharmacies ready to serve you
        </p>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : pharmacies.length === 0 ? (
          <p className="text-gray-500 text-center">
            No pharmacies found nearby.
          </p>
        ) : (
          <div className="space-y-4">
            {pharmacies.map((pharmacy) => {
              let distanceText = "Distance unknown";
              if (!userLocation) {
                distanceText = "Your location unknown";
              } else if (!pharmacy.latitude || !pharmacy.longitude) {
                distanceText = "Pharmacy location unknown";
              } else {
                distanceText = `${calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  pharmacy.latitude,
                  pharmacy.longitude
                )} km away`;
              }

              return (
                <PharmacyCard
                  key={pharmacy.id}
                  name={pharmacy.name}
                  distance={distanceText}
                  isOpen={true} // Assuming open for now
                  onView={() => onSelectPharmacy(pharmacy)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
