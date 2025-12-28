import { useState } from "react";
import { RiderLoginScreen } from "./RiderLoginScreen";
import { RiderLocationPermissionScreen } from "./RiderLocationPermissionScreen";
import { AvailableDeliveriesScreen } from "./AvailableDeliveriesScreen";
import { NavigationScreen } from "./NavigationScreen";
import { DeliveryHistoryScreen } from "./DeliveryHistoryScreen";
import { SignUpScreen } from "../SignUpScreen";

type RiderScreen =
  | "login"
  | "signup"
  | "location"
  | "deliveries"
  | "navigation"
  | "history";

type RiderData = {
  name: string;
  phone: string;
  vehicleType: string;
  hasLocation: boolean;
  location?: { lat: number; lng: number };
  activeDelivery?: {
    id: string;
    pharmacyLocation: string;
    customerLocation: string;
    distance: string;
    fee: number;
    currentStep: "going-to-pharmacy" | "going-to-customer" | "completed";
  };
};

export function RiderApp({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<RiderScreen>("login");
  const [riderData, setRiderData] = useState<RiderData>({
    name: "",
    phone: "",
    vehicleType: "",
    hasLocation: false,
  });

  const updateRiderData = (updates: Partial<RiderData>) => {
    setRiderData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <>
      {screen === "login" && (
        <RiderLoginScreen
          onContinue={(name, phone, vehicleType) => {
            updateRiderData({ name, phone, vehicleType });
            setScreen("location");
          }}
          onSignUp={() => setScreen("signup")}
          onBack={onBack}
        />
      )}

      {screen === "signup" && (
        <SignUpScreen
          role="rider"
          onBack={() => setScreen("login")}
          onSignUpSuccess={() => setScreen("login")}
        />
      )}

      {screen === "location" && (
        <RiderLocationPermissionScreen
          phone={riderData.phone}
          onLocationGranted={(location) => {
            updateRiderData({ hasLocation: true, location });
            setScreen("deliveries");
          }}
          onBack={() => setScreen("login")}
        />
      )}

      {screen === "deliveries" && (
        <AvailableDeliveriesScreen
          riderName={riderData.name}
          riderPhone={riderData.phone}
          onAcceptDelivery={(delivery) => {
            updateRiderData({ activeDelivery: delivery });
            setScreen("navigation");
          }}
          onViewHistory={() => setScreen("history")}
          onBack={() => setScreen("location")}
        />
      )}

      {screen === "history" && (
        <DeliveryHistoryScreen
          riderPhone={riderData.phone}
          onBack={() => setScreen("deliveries")}
        />
      )}

      {screen === "navigation" && riderData.activeDelivery && (
        <NavigationScreen
          delivery={riderData.activeDelivery}
          onUpdateDelivery={(updates) => {
            updateRiderData({
              activeDelivery: { ...riderData.activeDelivery!, ...updates },
            });
          }}
          onComplete={() => {
            updateRiderData({ activeDelivery: undefined });
            setScreen("deliveries");
          }}
          onBack={() => setScreen("deliveries")}
        />
      )}
    </>
  );
}
