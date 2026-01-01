import { useState } from "react";

type PaymentEntryModalProps = {
  pharmacyName: string;
  pharmacyPhone: string;
  onConfirm: (amount: number) => void;
  onCancel: () => void;
};

export function PaymentEntryModal({
  pharmacyName,
  pharmacyPhone,
  onConfirm,
  onCancel,
}: PaymentEntryModalProps) {
  const [amount, setAmount] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold mb-4 text-center">Make Payment</h3>
        
        <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Paying to:</p>
          <p className="font-bold text-lg text-gray-900">{pharmacyName}</p>
          <p className="text-gray-600 flex items-center gap-2">
            <span>📞</span> {pharmacyPhone}
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Amount (GHS)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-xl text-2xl font-bold text-center focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="0.00"
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(Number(amount))}
            disabled={!amount || Number(amount) <= 0}
            className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-200"
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}
