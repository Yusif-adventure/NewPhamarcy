import { useState } from "react";

type PaymentConfirmationModalProps = {
  amount: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export function PaymentConfirmationModal({
  amount,
  onConfirm,
  onCancel,
}: PaymentConfirmationModalProps) {
  const [pin, setPin] = useState("");

  const handleConfirm = () => {
    if (pin.length === 4) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 className="mb-6 text-center">Payment Confirmation</h3>

        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
          <p className="text-gray-600 mb-2">Amount to Pay</p>
          <div className="text-4xl font-bold text-blue-600">GHS {amount}</div>
        </div>

        <div className="mb-6">
          <label className="block mb-3 text-sm text-gray-600">Enter PIN</label>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="4-digit PIN"
            className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 text-center tracking-widest focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            disabled={pin.length !== 4}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Confirm Payment
          </button>

          <button
            onClick={onCancel}
            className="w-full bg-gray-200 text-gray-700 py-4 px-6 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
