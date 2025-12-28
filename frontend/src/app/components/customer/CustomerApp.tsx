import { useState, useEffect } from "react";
import { SignInScreen } from "./SignInScreen";
import { LocationPermissionScreen } from "./LocationPermissionScreen";
import { AvailablePharmaciesScreen } from "./AvailablePharmaciesScreen";
import { PharmacyDetailsScreen } from "./PharmacyDetailsScreen";
import { DeliveryTrackingScreen } from "./DeliveryTrackingScreen";
import { PaymentConfirmationModal } from "./PaymentConfirmationModal";
import { api } from "../../api";

type CustomerScreen =
  | "signin"
  | "location"
  | "pharmacies"
  | "pharmacy-details"
  | "delivery-tracking";

type CustomerData = {
  phone: string;
  name?: string;
  hasLocation: boolean;
  location?: { lat: number; lng: number };
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

export function CustomerApp({
  onBack,
  onSwitchRole,
}: {
  onBack: () => void;
  onSwitchRole?: (role: "rider" | "pharmacy") => void;
}) {
  const [screen, setScreen] = useState<CustomerScreen>("signin");
  const [customerData, setCustomerData] = useState<CustomerData>({
    phone: "",
    hasLocation: false,
    paymentStatus: "waiting",
    orderStatus: "waiting",
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const updateCustomerData = (updates: Partial<CustomerData>) => {
    setCustomerData((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    if (!customerData.phone) return;

    const pollOrder = async () => {
      try {
        const order = await api.orders.getActive(customerData.phone);
        if (order) {
          setActiveOrderId(order.id);

          // Update general status
          if (order.status === "out-for-delivery") {
            updateCustomerData({
              orderStatus: "rider-on-way",
              riderName: order.rider_name,
              riderPhone: order.rider_phone,
            });
          } else if (order.status === "delivered") {
            updateCustomerData({
              orderStatus: "delivered",
              riderName: order.rider_name,
              riderPhone: order.rider_phone,
            });
          }

          // Check for payment request
          if (order.status === "delivery-fee-requested") {
            setDeliveryFee(order.delivery_fee || 15);
            setShowPaymentModal(true);
          } else if (order.status === "delivery-fee-paid") {
            setShowPaymentModal(false);
          }
        }
      } catch (error) {
        console.error("Error polling order:", error);
      }
    };

    const interval = setInterval(pollOrder, 3000);
    return () => clearInterval(interval);
  }, [customerData.phone]);

  const handlePaymentConfirm = async () => {
    if (!activeOrderId) return;
    try {
      await api.orders.confirmDeliveryFee(activeOrderId);
      setShowPaymentModal(false);
      alert("Payment Successful!");
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <>
      {screen === "signin" && (
        <SignInScreen
          onContinue={(customer: any) => {
            updateCustomerData({ phone: customer.phone, name: customer.name });
            setScreen("location");
          }}
          onBack={onBack}
          onSwitchRole={onSwitchRole}
        />
      )}

      {screen === "location" && (
        <LocationPermissionScreen
          onLocationGranted={(location) => {
            updateCustomerData({ hasLocation: true, location });
            setScreen("pharmacies");
          }}
          onBack={() => setScreen("signin")}
        />
      )}

      {screen === "pharmacies" && (
        <AvailablePharmaciesScreen
          userLocation={customerData.location}
          onSelectPharmacy={(pharmacy) => {
            updateCustomerData({
              selectedPharmacy: pharmacy.name,
              selectedPharmacyPhone: pharmacy.phone,
            });
            setScreen("pharmacy-details");
          }}
          onBack={() => setScreen("location")}
        />
      )}

      {screen === "pharmacy-details" && (
        <PharmacyDetailsScreen
          customerData={customerData}
          onUpdateData={updateCustomerData}
          onViewDelivery={() => setScreen("delivery-tracking")}
          onBack={() => setScreen("pharmacies")}
        />
      )}

      {screen === "delivery-tracking" && (
        <DeliveryTrackingScreen
          customerData={customerData}
          onBack={() => setScreen("pharmacy-details")}
          onUpdateData={updateCustomerData}
        />
      )}

      {showPaymentModal && (
        <PaymentConfirmationModal
          amount={deliveryFee}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}
    </>
  );
}
