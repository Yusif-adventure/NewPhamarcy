import { useState } from "react";
import { PharmacyLoginScreen } from "./PharmacyLoginScreen";
import { SetLocationScreen } from "./SetLocationScreen";
import { PharmacyDashboard } from "./PharmacyDashboard";
import { SignUpScreen } from "../SignUpScreen";

type PharmacyScreen = "login" | "signup" | "location" | "dashboard";

type PharmacyData = {
  name: string;
  phone: string;
  hasLocation: boolean;
  location?: { lat: number; lng: number };
};

export function PharmacyApp({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<PharmacyScreen>("login");
  const [pharmacyData, setPharmacyData] = useState<PharmacyData>({
    name: "",
    phone: "",
    hasLocation: false,
  });

  const updatePharmacyData = (updates: Partial<PharmacyData>) => {
    setPharmacyData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <>
      {screen === "login" && (
        <PharmacyLoginScreen
          onLogin={(name, phone, location) => {
            updatePharmacyData({ name, phone, location, hasLocation: !!location });
            if (location) {
              setScreen("dashboard");
            } else {
              setScreen("location");
            }
          }}
          onSignUp={() => setScreen("signup")}
          onBack={onBack}
        />
      )}

      {screen === "signup" && (
        <SignUpScreen
          role="pharmacy"
          onBack={() => setScreen("login")}
          onSignUpSuccess={() => setScreen("login")}
        />
      )}

      {screen === "location" && (
        <SetLocationScreen
          phone={pharmacyData.phone}
          onLocationSet={(location) => {
            updatePharmacyData({ hasLocation: true, location });
            setScreen("dashboard");
          }}
          onBack={() => setScreen("login")}
        />
      )}

      {screen === "dashboard" && (
        <PharmacyDashboard
          pharmacyData={pharmacyData}
          onBack={() => setScreen("location")}
        />
      )}
    </>
  );
}
