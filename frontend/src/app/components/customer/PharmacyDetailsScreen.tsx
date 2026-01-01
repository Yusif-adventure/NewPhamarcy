import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Phone,
  CreditCard,
  Truck,
  Trash2,
  History,
} from "lucide-react";
import { PaymentConfirmationModal } from "./PaymentConfirmationModal";
import { PaymentEntryModal } from "./PaymentEntryModal";
import { api } from "../../api";

type CustomerData = {
  phone: string;
  name?: string;
  hasLocation: boolean;
  selectedPharmacy?: string;
  selectedPharmacyPhone?: string;
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

type OrderHistoryItem = {
  id: string;
  created_at: string;
  amount: number;
  rider_name: string;
  status: string;
};

type PharmacyDetailsScreenProps = {
  customerData: CustomerData;
  onUpdateData: (updates: Partial<CustomerData>) => void;
  onViewDelivery: () => void;
  onBack: () => void;
};

export function PharmacyDetailsScreen({
  customerData,
  onUpdateData,
  onViewDelivery,
  onBack,
}: PharmacyDetailsScreenProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [history, setHistory] = useState<OrderHistoryItem[]>([]);

  // Poll for active order status
  useEffect(() => {
    const pollOrder = async () => {
      try {
        const order = await api.orders.getActive(customerData.phone);

        if (order) {
          // Only show order if it belongs to the selected pharmacy
          if (order.pharmacy_phone === customerData.selectedPharmacyPhone) {
            setActiveOrderId(order.id);

            // Map backend status to frontend state
            if (order.status === "new") {
              onUpdateData({
                paymentStatus: "requested",
                orderStatus: "waiting",
                paymentAmount: undefined,
              });
            } else if (order.status === "payment-pending") {
              onUpdateData({
                paymentStatus: "requested",
                orderStatus: "waiting",
                paymentAmount: order.amount,
              });
            } else if (order.status === "payment-received") {
              onUpdateData({
                paymentStatus: "paid",
                orderStatus: "preparing",
              });
            } else if (order.status === "ready") {
              onUpdateData({
                paymentStatus: "paid",
                orderStatus: "finding-rider",
              });
            } else if (order.status === "out-for-delivery") {
              onUpdateData({
                paymentStatus: "paid",
                orderStatus: "rider-on-way",
                riderName: order.rider_name,
                riderPhone: order.rider_phone,
              });
            } else if (order.status === "delivered") {
              onUpdateData({
                paymentStatus: "paid",
                orderStatus: "delivered",
                riderName: order.rider_name,
                riderPhone: order.rider_phone,
              });
            }
          } else {
            // Active order is for a different pharmacy, so treat as no active order for this pharmacy
            setActiveOrderId(null);
            onUpdateData({
              paymentStatus: "waiting",
              orderStatus: "waiting",
              paymentAmount: undefined,
              riderName: undefined,
              riderPhone: undefined,
            });
          }
        } else {
          // No active order found (maybe deleted), reset state
          setActiveOrderId(null);
          onUpdateData({
            paymentStatus: "waiting",
            orderStatus: "waiting",
            paymentAmount: undefined,
            riderName: undefined,
            riderPhone: undefined,
          });
        }
      } catch (error) {
        console.error("Error polling order:", error);
      }
    };

    const fetchHistory = async () => {
      try {
        const data = await api.orders.getCustomerHistory(customerData.phone);
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(() => {
      pollOrder();
      fetchHistory();
    }, 3000);

    pollOrder(); // Initial check
    fetchHistory();

    return () => clearInterval(interval);
  }, [customerData.phone]);

  // Handle customer requesting to pay
  const handleRequestPayment = () => {
    if (
      customerData.paymentStatus === "waiting" ||
      customerData.orderStatus === "delivered"
    ) {
      // Open entry modal for customer to enter amount
      setShowEntryModal(true);
    } else if (
      customerData.paymentStatus === "requested" &&
      customerData.paymentAmount
    ) {
      // Customer received amount from pharmacy (legacy flow) or re-trying payment
      setShowPaymentModal(true);
    }
  };

  const handleEntryConfirm = async (amount: number) => {
    try {
      const pharmacyPhone = customerData.selectedPharmacyPhone;

      if (!pharmacyPhone) {
        alert(
          "Error: Pharmacy phone number not found. Please go back and select the pharmacy again."
        );
        return;
      }

      console.log("Creating order with:", {
        customerPhone: customerData.phone,
        pharmacyPhone,
        amount,
      });

      const order = await api.orders.create(
        customerData.phone,
        pharmacyPhone,
        amount
      );
      setActiveOrderId(order.id);

      onUpdateData({
        paymentStatus: "requested",
        orderStatus: "waiting",
        paymentAmount: amount,
      });

      // Close entry modal and open payment modal immediately
      setShowEntryModal(false);
      setShowPaymentModal(true);
    } catch (error: any) {
      console.error("Failed to create order:", error);
      alert(`Failed to initiate payment: ${error.message}`);
    }
  };

  const handleDeleteHistory = async (orderId: string) => {
    if (
      window.confirm("Are you sure you want to delete this order from history?")
    ) {
      try {
        await api.orders.deleteOrder(orderId);
        setHistory(history.filter((h) => h.id !== orderId));

        // If the deleted order was the active one, reset the view immediately
        if (activeOrderId === orderId) {
          setActiveOrderId(null);
          onUpdateData({
            paymentStatus: "waiting",
            orderStatus: "waiting",
            paymentAmount: undefined,
            riderName: undefined,
            riderPhone: undefined,
          });
        }
      } catch (error) {
        console.error("Failed to delete order:", error);
        alert("Failed to delete order");
      }
    }
  };

  const handlePaymentConfirm = async () => {
    if (!activeOrderId) return;

    try {
      await api.orders.confirmPayment(activeOrderId);

      onUpdateData({
        paymentStatus: "paid",
        orderStatus: "preparing",
      });
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Failed to confirm payment:", error);
      alert("Failed to process payment. Please try again.");
    }
  };

  const handleCancelOrder = async () => {
    if (!activeOrderId) return;
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await api.orders.deleteOrder(activeOrderId);
        setActiveOrderId(null);
        onUpdateData({
          paymentStatus: "waiting",
          orderStatus: "waiting",
          paymentAmount: undefined,
          riderName: undefined,
          riderPhone: undefined,
        });
      } catch (error) {
        console.error("Failed to cancel order:", error);
        alert("Failed to cancel order");
      }
    }
  };

  const getStatusText = () => {
    switch (customerData.orderStatus) {
      case "waiting":
        if (customerData.paymentStatus === "waiting") {
          return "💊 Ready to order medicine";
        } else if (
          customerData.paymentStatus === "requested" &&
          !customerData.paymentAmount
        ) {
          return "⏳ Waiting for pharmacy to enter amount";
        } else if (
          customerData.paymentStatus === "requested" &&
          customerData.paymentAmount
        ) {
          return "💳 Payment amount received - tap Pay button";
        }
        return "⏳ Waiting for payment request";
      case "preparing":
        return "📦 Preparing order";
      case "finding-rider":
        return "🔍 Finding rider";
      case "rider-on-way":
        return "🚚 Rider on the way";
      case "delivered":
        return "✅ Order Delivered";
      default:
        return "⏳ Waiting for payment request";
    }
  };

  const getPayButtonText = () => {
    if (customerData.orderStatus === "delivered") {
      return "💳 Pay for Medicine";
    }
    if (customerData.paymentStatus === "waiting") {
      return "💳 Pay for Medicine";
    } else if (
      customerData.paymentStatus === "requested" &&
      !customerData.paymentAmount
    ) {
      return "⏳ Waiting for Amount...";
    } else if (
      customerData.paymentStatus === "requested" &&
      customerData.paymentAmount
    ) {
      return `💳 Pay GHS ${customerData.paymentAmount}`;
    } else {
      return "✓ Payment Complete";
    }
  };

  const isPayButtonEnabled = () => {
    return (
      customerData.paymentStatus === "waiting" ||
      (customerData.paymentStatus === "requested" &&
        customerData.paymentAmount) ||
      customerData.orderStatus === "delivered"
    );
  };

  const canViewDelivery =
    customerData.orderStatus === "finding-rider" ||
    customerData.orderStatus === "rider-on-way" ||
    customerData.orderStatus === "delivered";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <button onClick={onBack} className="mb-8">
          <ChevronLeft className="w-8 h-8 text-gray-700" />
        </button>

        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h2 className="mb-2">{customerData.selectedPharmacy}</h2>
          <div className="flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>
              {customerData.selectedPharmacyPhone || "Phone not available"}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <button
            onClick={() => {
              if (customerData.selectedPharmacyPhone) {
                window.location.href = `tel:${customerData.selectedPharmacyPhone}`;
              } else {
                alert("Pharmacy phone number not available");
              }
            }}
            className="w-full bg-green-600 text-white py-6 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3"
          >
            <Phone className="w-6 h-6" />
            <span>📞 Call Pharmacy</span>
          </button>

          <button
            onClick={handleRequestPayment}
            disabled={!isPayButtonEnabled()}
            className="w-full bg-blue-600 text-white py-6 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <CreditCard className="w-6 h-6" />
            <span>{getPayButtonText()}</span>
          </button>

          {/* Cancel Button for stuck orders */}
          {customerData.paymentStatus === "requested" &&
            !customerData.paymentAmount && (
              <button
                onClick={handleCancelOrder}
                className="w-full bg-red-100 text-red-600 py-4 px-6 rounded-xl shadow-sm flex items-center justify-center gap-3 hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span>Cancel Request</span>
              </button>
            )}

          {canViewDelivery ? (
            <button
              onClick={onViewDelivery}
              className="w-full bg-purple-600 text-white py-6 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3"
            >
              <Truck className="w-6 h-6" />
              <span>🚚 View Delivery Status</span>
            </button>
          ) : (
            <div className="w-full bg-gray-100 text-gray-500 py-6 px-6 rounded-xl flex items-center justify-center gap-3">
              <Truck className="w-6 h-6" />
              <span>🚚 Delivery Status</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="mb-4">Order Status</h3>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
            <p className="text-blue-900">{getStatusText()}</p>
          </div>
        </div>

        {/* Order History Section */}
        {history.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Order History
            </h3>
            <div className="space-y-3">
              {history.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Rider: {order.rider_name || "Unknown"}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      GHS {order.amount}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteHistory(order.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showEntryModal && (
        <PaymentEntryModal
          pharmacyName={customerData.selectedPharmacy || "Pharmacy"}
          pharmacyPhone={customerData.selectedPharmacyPhone || ""}
          onConfirm={handleEntryConfirm}
          onCancel={() => setShowEntryModal(false)}
        />
      )}

      {showPaymentModal && (
        <PaymentConfirmationModal
          amount={customerData.paymentAmount || 0}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
