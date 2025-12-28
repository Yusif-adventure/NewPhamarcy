import { useState, useEffect } from "react";
import {
  ChevronLeft,
  MapPin,
  Navigation,
  Check,
  CreditCard,
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

type NavigationScreenProps = {
  delivery: Delivery;
  onUpdateDelivery: (updates: Partial<Delivery>) => void;
  onComplete: () => void;
  onBack: () => void;
};

export function NavigationScreen({
  delivery,
  onUpdateDelivery,
  onComplete,
  onBack,
}: NavigationScreenProps) {
  const [cashReceived, setCashReceived] = useState(false);
  const [paymentRequested, setPaymentRequested] = useState(false);
  const [onlinePaymentReceived, setOnlinePaymentReceived] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const order = await api.orders.getById(delivery.id);
        if (order.status === "delivery-fee-paid") {
          setOnlinePaymentReceived(true);
        } else if (order.status === "delivery-fee-requested") {
          setPaymentRequested(true);
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkStatus();
  }, [delivery.id]);

  useEffect(() => {
    let interval: any;
    if (paymentRequested && !onlinePaymentReceived) {
      interval = setInterval(async () => {
        try {
          const order = await api.orders.getById(delivery.id);
          if (order.status === "delivery-fee-paid") {
            setOnlinePaymentReceived(true);
            setPaymentRequested(false); // Stop polling/showing request state if needed
          }
        } catch (e) {
          console.error(e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [paymentRequested, onlinePaymentReceived, delivery.id]);

  const handlePickedUp = () => {
    onUpdateDelivery({ currentStep: "going-to-customer" });
  };

  const handleRequestPayment = async () => {
    try {
      await api.orders.requestDeliveryFee(delivery.id);
      setPaymentRequested(true);
    } catch (error) {
      console.error("Error requesting payment:", error);
      alert("Failed to request payment");
    }
  };

  const handleDelivered = async () => {
    if (cashReceived || onlinePaymentReceived) {
      try {
        await api.orders.completeDelivery(delivery.id);
        onUpdateDelivery({ currentStep: "completed" });
        setTimeout(onComplete, 1500);
      } catch (error) {
        console.error("Error completing delivery:", error);
        alert("Failed to complete delivery. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <button onClick={onBack} className="mb-8">
          <ChevronLeft className="w-8 h-8 text-gray-700" />
        </button>

        <h1 className="mb-8">Navigation</h1>

        {/* Map View Placeholder */}
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-12 mb-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-12 h-12 text-purple-600" />
            </div>
            <p className="text-gray-700">Map View</p>
            <p className="text-sm text-gray-600 mt-2">
              {delivery.currentStep === "going-to-pharmacy"
                ? "Navigate to Pharmacy"
                : "Navigate to Customer"}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="mb-6">Delivery Steps</h3>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  delivery.currentStep !== "going-to-pharmacy"
                    ? "bg-green-600"
                    : "bg-purple-600"
                }`}
              >
                {delivery.currentStep !== "going-to-pharmacy" ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white">1</span>
                )}
              </div>
              <div className="flex-1">
                <p className="mb-2">Go to Pharmacy</p>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{delivery.pharmacyLocation}</p>
                </div>
                {delivery.currentStep === "going-to-pharmacy" && (
                  <button
                    onClick={handlePickedUp}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg mt-4"
                  >
                    Picked Up Package
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  delivery.currentStep === "completed"
                    ? "bg-green-600"
                    : delivery.currentStep === "going-to-customer"
                    ? "bg-purple-600"
                    : "bg-gray-200"
                }`}
              >
                {delivery.currentStep === "completed" ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span
                    className={
                      delivery.currentStep === "going-to-customer"
                        ? "text-white"
                        : "text-gray-400"
                    }
                  >
                    2
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`mb-2 ${
                    delivery.currentStep === "going-to-pharmacy"
                      ? "text-gray-400"
                      : ""
                  }`}
                >
                  Go to Customer
                </p>
                <div
                  className={`flex items-start gap-2 text-sm ${
                    delivery.currentStep === "going-to-pharmacy"
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                >
                  <Navigation className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{delivery.customerLocation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Delivery */}
        {delivery.currentStep === "going-to-customer" && (
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="mb-6">Complete Delivery</h3>

            <div className="space-y-4 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cashReceived}
                  onChange={(e) => {
                    setCashReceived(e.target.checked);
                    if (e.target.checked) {
                      setPaymentRequested(false);
                      setOnlinePaymentReceived(false);
                    }
                  }}
                  disabled={onlinePaymentReceived}
                  className="w-6 h-6 rounded border-2 border-gray-300"
                />
                <span>Cash Received</span>
              </label>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    onlinePaymentReceived
                      ? "border-green-600 bg-green-600"
                      : "border-gray-300"
                  }`}
                >
                  {onlinePaymentReceived && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
                <span
                  className={
                    onlinePaymentReceived ? "text-green-600 font-medium" : ""
                  }
                >
                  {onlinePaymentReceived
                    ? "Online Payment Received"
                    : "Online Payment"}
                </span>
              </div>

              {!onlinePaymentReceived && !cashReceived && (
                <button
                  onClick={handleRequestPayment}
                  disabled={paymentRequested}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                    paymentRequested
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  {paymentRequested
                    ? "Payment Requested..."
                    : "Request Online Payment"}
                </button>
              )}
            </div>

            <button
              onClick={handleDelivered}
              disabled={!cashReceived && !onlinePaymentReceived}
              className="w-full bg-green-600 text-white py-5 px-6 rounded-xl shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Mark as Delivered ✓
            </button>
          </div>
        )}

        {delivery.currentStep === "completed" && (
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Delivery Completed!
            </h2>
            <p className="text-green-700">You earned GHS {delivery.fee}</p>
          </div>
        )}
      </div>
    </div>
  );
}
