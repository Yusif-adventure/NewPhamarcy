import { useState } from "react";
import { CustomerApp } from "./components/customer/CustomerApp";
import { PharmacyApp } from "./components/pharmacy/PharmacyApp";
import { RiderApp } from "./components/rider/RiderApp";

type UserType = "customer" | "pharmacy" | "rider" | null;

export default function App() {
  const [userType, setUserType] = useState<UserType>("customer");

  if (userType === "customer") {
    return (
      <CustomerApp
        onBack={() => {}}
        onSwitchRole={(role) => setUserType(role)}
      />
    );
  }

  if (userType === "pharmacy") {
    return <PharmacyApp onBack={() => setUserType("customer")} />;
  }

  if (userType === "rider") {
    return <RiderApp onBack={() => setUserType("customer")} />;
  }

  return null;
}
