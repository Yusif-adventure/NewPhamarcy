import { useState, useEffect } from "react";
import { ChevronLeft, Clock, CheckCircle } from "lucide-react";
import { api } from "../../api";

type DeliveryHistory = {
  id: string;
  pharmacyLocation: string;
  customerLocation: string;
  fee: number;
  completedAt: string;
};

type DeliveryHistoryScreenProps = {
  riderPhone: string;
  onBack: () => void;
};

export function DeliveryHistoryScreen({
  riderPhone,
  onBack,
}: DeliveryHistoryScreenProps) {
  const [history, setHistory] = useState<DeliveryHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.orders.getRiderHistory(riderPhone);
        const mappedHistory = data.map((order: any) => ({
          id: order.id,
          pharmacyLocation: "Pharmacy Location", // Placeholder as we don't store address yet
          customerLocation: "Customer Location", // Placeholder
          fee: order.amount || 150, // Fallback fee
          completedAt: new Date(order.created_at).toLocaleDateString(), // Using created_at for now
        }));
        setHistory(mappedHistory);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [riderPhone]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-6 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack}>
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold">Delivery History</h1>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading history...</p>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No deliveries yet
            </h3>
            <p className="text-gray-500">
              Completed deliveries will appear here
            </p>
          </div>
        ) : (
          history.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed</span>
                </div>
                <span className="text-gray-400 text-xs">
                  {delivery.completedAt}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex gap-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 mb-1"></div>
                    <div className="w-0.5 h-6 bg-gray-200 mx-auto"></div>
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="text-sm font-medium">
                        {delivery.pharmacyLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Dropoff</p>
                      <p className="text-sm font-medium">
                        {delivery.customerLocation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                <span className="text-sm text-gray-500">Earning</span>
                <span className="font-semibold text-green-600">
                  GHS {delivery.fee}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
