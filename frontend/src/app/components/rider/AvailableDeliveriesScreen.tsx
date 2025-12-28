import { useState, useEffect } from "react";
import {
  ChevronLeft,
  MapPin,
  Navigation,
  History,
  Wallet,
  TrendingUp,
  Power,
} from "lucide-react";
import { api } from "../../api";

type Delivery = {
  id: string;
  pharmacyLocation: string;
  customerLocation: string;
  distance: string;
  fee: number;
  currentStep: "going-to-pharmacy" | "going-to-customer" | "completed";
};

type DeliveryCardProps = {
  delivery: Delivery;
  onAccept: () => void;
};

function DeliveryCard({ delivery, onAccept }: DeliveryCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-100">
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-600 mb-1">Pickup</p>
            <p className="">{delivery.pharmacyLocation}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Navigation className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-600 mb-1">Delivery</p>
            <p className="">{delivery.customerLocation}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-xl">
        <div>
          <p className="text-sm text-gray-600">Distance</p>
          <p className="">{delivery.distance}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Delivery Fee</p>
          <p className="text-green-600">GHS {delivery.fee}</p>
        </div>
      </div>

      <button
        onClick={onAccept}
        className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl"
      >
        Accept Delivery
      </button>
    </div>
  );
}

type AvailableDeliveriesScreenProps = {
  riderName: string;
  riderPhone: string;
  onAcceptDelivery: (delivery: Delivery) => void;
  onViewHistory: () => void;
  onBack: () => void;
};

export function AvailableDeliveriesScreen({
  riderName,
  riderPhone,
  onAcceptDelivery,
  onViewHistory,
  onBack,
}: AvailableDeliveriesScreenProps) {
  const [availableDeliveries, setAvailableDeliveries] = useState<Delivery[]>(
    []
  );
  const [isOnline, setIsOnline] = useState(true);
  const [stats, setStats] = useState({ earnings: 0, trips: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available deliveries
        const deliveriesData = await api.orders.getAvailable();
        const mappedDeliveries: Delivery[] = deliveriesData.map((o: any) => ({
          id: o.id,
          pharmacyLocation: "Pharmacy Location", // Placeholder
          customerLocation: "Customer Location", // Placeholder
          distance: "2.5 km", // Placeholder
          fee: 150, // Placeholder
          currentStep: "going-to-pharmacy",
        }));
        setAvailableDeliveries(mappedDeliveries);

        // Fetch history for stats
        const historyData = await api.orders.getRiderHistory(riderPhone);
        const totalEarnings = historyData.reduce(
          (sum: number, order: any) => sum + (order.amount || 150),
          0
        );
        setStats({
          earnings: totalEarnings,
          trips: historyData.length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(fetchData, 3000);
    fetchData();

    return () => clearInterval(interval);
  }, [riderPhone]);

  const handleAccept = async (delivery: Delivery) => {
    try {
      await api.orders.acceptDelivery(delivery.id, riderName, riderPhone);
      onAcceptDelivery(delivery);
    } catch (error) {
      console.error("Error accepting delivery:", error);
      alert("Failed to accept delivery");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white p-6 shadow-sm rounded-b-3xl mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Hi, {riderName}
              </h1>
              <p className="text-sm text-gray-500">Ready to deliver?</p>
            </div>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isOnline
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <Power className="w-4 h-4" />
            {isOnline ? "Online" : "Offline"}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
            <div className="flex items-center gap-2 mb-2 text-purple-600">
              <Wallet className="w-5 h-5" />
              <span className="text-sm font-medium">Earnings</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              GHS {stats.earnings}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Trips</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.trips}</p>
          </div>
        </div>

        <button
          onClick={onViewHistory}
          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <History className="w-5 h-5 text-gray-700" />
            </div>
            <span className="font-medium text-gray-700">
              View Delivery History
            </span>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
        </button>
      </div>

      {/* Available Deliveries Section */}
      <div className="p-6 pt-0">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Available Deliveries
        </h2>

        {!isOnline ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Power className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              You are Offline
            </h3>
            <p className="text-gray-500">
              Go online to see available deliveries
            </p>
          </div>
        ) : availableDeliveries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No deliveries found
            </h3>
            <p className="text-gray-500">Waiting for new orders...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableDeliveries.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onAccept={() => handleAccept(delivery)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
