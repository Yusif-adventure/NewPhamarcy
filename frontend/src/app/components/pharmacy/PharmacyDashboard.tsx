import { useState, useEffect } from "react";
import { ChevronLeft, CheckCircle } from "lucide-react";
import { EnterCostModal } from "./EnterCostModal";
import { RiderAssignedModal } from "./RiderAssignedModal";
import { SearchingRiderModal } from "./SearchingRiderModal";
import { api } from "../../api";

type Order = {
  id: string;
  customerPhone: string;
  status:
    | "new"
    | "payment-pending"
    | "payment-received"
    | "ready"
    | "out-for-delivery"
    | "delivered";
  amount?: number;
  riderName?: string;
  riderPhone?: string;
  created_at: string;
};

type PharmacyData = {
  name: string;
  phone: string;
  hasLocation: boolean;
};

type PharmacyDashboardProps = {
  pharmacyData: PharmacyData;
  onBack: () => void;
};

export function PharmacyDashboard({
  pharmacyData,
  onBack,
}: PharmacyDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCostModal, setShowCostModal] = useState(false);
  const [showRiderModal, setShowRiderModal] = useState(false);
  const [searchingOrderId, setSearchingOrderId] = useState<string | null>(null);

  // Poll for orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.orders.getPharmacyOrders(pharmacyData.phone);
        // Map backend data to frontend Order type
        const mappedOrders: Order[] = data.map((o: any) => ({
          id: o.id,
          customerPhone: o.customer_phone,
          status: o.status,
          amount: o.amount,
          riderName: o.rider_name,
          riderPhone: o.rider_phone,
          created_at: o.created_at,
        }));
        setOrders(mappedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const interval = setInterval(fetchOrders, 3000);
    fetchOrders(); // Initial fetch

    return () => clearInterval(interval);
  }, [pharmacyData.phone]);

  const handleEnterCost = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowCostModal(true);
    }
  };

  const handleSubmitCost = async (amount: number) => {
    if (selectedOrder) {
      try {
        await api.orders.updateCost(selectedOrder.id, amount);
        // Optimistic update or wait for poll
        setOrders(
          orders.map((o) =>
            o.id === selectedOrder.id
              ? { ...o, amount, status: "payment-pending" as const }
              : o
          )
        );
      } catch (error) {
        console.error("Error updating cost:", error);
        alert("Failed to update cost");
      }
    }
    setShowCostModal(false);
    setSelectedOrder(null);
  };

  const handleRequestRider = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      try {
        await api.orders.requestRider(orderId);
        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, status: "ready" as const } : o
          )
        );
        setSearchingOrderId(orderId);
      } catch (error: any) {
        console.error("Error requesting rider:", error);
        alert(`Failed to request rider: ${error.message}`);
      }
    }
  };

  const handleCancelRiderRequest = async () => {
    if (searchingOrderId) {
      if (window.confirm("Are you sure you want to cancel the rider request?")) {
        try {
          await api.orders.cancelRiderRequest(searchingOrderId);
          setOrders(
            orders.map((o) =>
              o.id === searchingOrderId
                ? { ...o, status: "payment-received" as const }
                : o
            )
          );
          setSearchingOrderId(null);
        } catch (error) {
          console.error("Error canceling rider request:", error);
          alert("Failed to cancel rider request");
        }
      }
    }
  };

  const handleCustomerPickup = async (orderId: string) => {
    if (window.confirm("Confirm that customer has picked up the order?")) {
      try {
        await api.orders.markAsPickedUp(orderId);
        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, status: "delivered" as const } : o
          )
        );
      } catch (error) {
        console.error("Error marking as picked up:", error);
        alert("Failed to update order");
      }
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this order? This will remove it from the list."
      )
    ) {
      try {
        await api.orders.deleteOrder(orderId);
        setOrders(orders.filter((o) => o.id !== orderId));
      } catch (error) {
        console.error("Error canceling order:", error);
        alert("Failed to cancel order");
      }
    }
  };

  const handlePackageHandedOver = () => {
    if (selectedOrder) {
      setOrders(
        orders.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, status: "out-for-delivery" as const }
            : o
        )
      );
    }
    setShowRiderModal(false);
    setSelectedOrder(null);
  };

  const customerPaymentRequests = orders.filter((o) => o.status === "new");
  const paymentRequests = orders.filter(
    (o) => o.status === "payment-pending" || o.status === "payment-received"
  );
  const trackedDeliveries = orders.filter(
    (o) => o.status === "out-for-delivery" || o.status === "delivered"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 text-white p-6 pb-8">
        <button onClick={onBack} className="mb-4">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <h1 className="mb-1">{pharmacyData.name}</h1>
        <p className="text-green-100">Dashboard</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Payment Requests */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="mb-4">🔔 Customer Payment Requests</h3>
          {customerPaymentRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No payment requests
            </p>
          ) : (
            <div className="space-y-3">
              {customerPaymentRequests.map((order) => (
                <div
                  key={order.id}
                  className="border-2 border-orange-200 bg-orange-50 rounded-xl p-4"
                >
                  <p className="mb-3">{order.customerPhone}</p>
                  <button
                    onClick={() => handleEnterCost(order.id)}
                    className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg"
                  >
                    Enter Medicine Cost
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="mb-4">💳 Payment Status</h3>
          {paymentRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No pending payments
            </p>
          ) : (
            <div className="space-y-3">
              {paymentRequests.map((order) => (
                <div
                  key={order.id}
                  className="border-2 border-gray-100 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">
                      {order.customerPhone}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "payment-received"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status === "payment-received"
                        ? "Paid ✓"
                        : "Pending"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Amount</p>
                    <p className="">GHS {order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ready for Delivery */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="mb-4">📦 Ready for Delivery</h3>
          {orders.filter((o) => o.status === "payment-received").length ===
          0 ? (
            <p className="text-gray-500 text-center py-4">No orders ready</p>
          ) : (
            <div className="space-y-3">
              {orders
                .filter((o) => o.status === "payment-received")
                .map((order) => (
                  <div
                    key={order.id}
                    className="border-2 border-gray-100 rounded-xl p-4"
                  >
                    <p className="mb-3">{order.customerPhone}</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRequestRider(order.id)}
                          className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg text-sm font-medium"
                        >
                          Request Rider
                        </button>
                        <button
                          onClick={() => handleCustomerPickup(order.id)}
                          className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          Picked Up
                        </button>
                      </div>
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-100 border border-red-100"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Delivery Tracking Table */}
        <div className="bg-white rounded-2xl p-6 shadow-md overflow-hidden">
          <h3 className="mb-4">🚚 Delivery Tracking</h3>
          {trackedDeliveries.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No active or completed deliveries
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-sm text-gray-500">
                    <th className="py-3 font-medium">Date & Time</th>
                    <th className="py-3 font-medium">Customer</th>
                    <th className="py-3 font-medium">Rider</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trackedDeliveries.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-50 last:border-0"
                    >
                      <td className="py-4">
                        <div className="flex flex-col">
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
                      </td>
                      <td className="py-4 text-sm">{order.customerPhone}</td>
                      <td className="py-4">
                        <p className="text-sm font-medium">{order.riderName}</p>
                        <p className="text-xs text-gray-500">
                          {order.riderPhone}
                        </p>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-6">
                          {/* Out for Delivery Step */}
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                order.status === "out-for-delivery" ||
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <CheckCircle className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              On Way
                            </span>
                          </div>

                          <div
                            className={`h-0.5 w-16 ${
                              order.status === "delivered"
                                ? "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />

                          {/* Delivered Step */}
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <CheckCircle className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              Delivered
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showCostModal && (
        <EnterCostModal
          onSubmit={handleSubmitCost}
          onCancel={() => {
            setShowCostModal(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {showRiderModal && selectedOrder && (
        <RiderAssignedModal
          riderName={selectedOrder.riderName || ""}
          riderPhone={selectedOrder.riderPhone || ""}
          onHandedOver={handlePackageHandedOver}
        />
      )}

      {searchingOrderId && orders.find((o) => o.id === searchingOrderId) && (
        <SearchingRiderModal
          order={orders.find((o) => o.id === searchingOrderId)!}
          onClose={() => setSearchingOrderId(null)}
          onCancelRequest={handleCancelRiderRequest}
        />
      )}
    </div>
  );
}
