import { useState } from "react";

type EnterCostModalProps = {
  onSubmit: (amount: number) => void;
  onCancel: () => void;
};

export function EnterCostModal({ onSubmit, onCancel }: EnterCostModalProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onSubmit(numAmount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 className="mb-6 text-center">Enter Medicine Cost</h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Amount (GHS)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:border-green-600"
          />
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full bg-green-600 text-white py-4 px-6 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send Payment Request
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
