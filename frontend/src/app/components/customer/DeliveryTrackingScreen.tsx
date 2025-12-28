import { ChevronLeft, Phone, Check } from "lucide-react";

type CustomerData = {
  phone: string;
  name?: string;
  hasLocation: boolean;
  selectedPharmacy?: string;
  paymentStatus: "waiting" | "requested" | "paid";
  orderStatus:
    | "waiting"
    | "preparing"
    | "finding-rider"
    | "rider-on-way"
    | "picked"
    | "delivered";
  paymentAmount?: number;
  riderName?: string;
  riderPhone?: string;
};

type DeliveryTrackingScreenProps = {
  customerData: CustomerData;
  onBack: () => void;
  onUpdateData: (updates: Partial<CustomerData>) => void;
};

export function DeliveryTrackingScreen({
  customerData,
  onBack,
}: DeliveryTrackingScreenProps) {
  const isCompleted = (status: string) => {
    const statuses = ["picked", "on-way", "delivered"];
    const currentIndex = statuses.indexOf(
      customerData.orderStatus === "rider-on-way"
        ? "on-way"
        : customerData.orderStatus === "picked"
        ? "picked"
        : customerData.orderStatus === "delivered"
        ? "delivered"
        : ""
    );
    const statusIndex = statuses.indexOf(status);
    return statusIndex <= currentIndex;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <button onClick={onBack} className="mb-8">
          <ChevronLeft className="w-8 h-8 text-gray-700" />
        </button>

        <h1 className="mb-8">Delivery Tracking</h1>

        <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 mb-1">Rider</p>
              <h3>{customerData.riderName || "Finding rider..."}</h3>
            </div>
            {customerData.riderPhone && (
              <button
                onClick={() =>
                  (window.location.href = `tel:${customerData.riderPhone}`)
                }
                className="bg-green-600 text-white p-4 rounded-full"
              >
                <Phone className="w-5 h-5" />
              </button>
            )}
          </div>
          {customerData.riderPhone && (
            <p className="text-gray-600">{customerData.riderPhone}</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="mb-6">Status Timeline</h3>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted("picked") ? "bg-green-600" : "bg-gray-200"
                }`}
              >
                {isCompleted("picked") && (
                  <Check className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p
                  className={
                    isCompleted("picked") ? "text-gray-900" : "text-gray-400"
                  }
                >
                  Picked from pharmacy
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted("on-way") ? "bg-green-600" : "bg-gray-200"
                }`}
              >
                {isCompleted("on-way") && (
                  <Check className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p
                  className={
                    isCompleted("on-way") ? "text-gray-900" : "text-gray-400"
                  }
                >
                  On the way
                </p>
                {isCompleted("on-way") && !isCompleted("delivered") && (
                  <p className="text-sm text-blue-600 mt-1">
                    Rider is heading to your location
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted("delivered") ? "bg-green-600" : "bg-gray-200"
                }`}
              >
                {isCompleted("delivered") && (
                  <Check className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p
                  className={
                    isCompleted("delivered") ? "text-gray-900" : "text-gray-400"
                  }
                >
                  Delivered ✅
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
