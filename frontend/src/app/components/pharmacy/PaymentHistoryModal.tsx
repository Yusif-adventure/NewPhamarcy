import { X } from "lucide-react";

type Order = {
  id: string;
  customerPhone: string;
  amount?: number;
  created_at: string;
  status: string;
};

type PaymentHistoryModalProps = {
  orders: Order[];
  onClose: () => void;
};

export function PaymentHistoryModal({
  orders,
  onClose,
}: PaymentHistoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No payment history found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100 text-sm text-gray-500">
                  <th className="py-3 font-medium">Date & Time</th>
                  <th className="py-3 font-medium">Customer</th>
                  <th className="py-3 font-medium">Amount</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
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
                    <td className="py-4 text-sm text-gray-600">
                      {order.customerPhone}
                    </td>
                    <td className="py-4 font-bold text-green-600">
                      GHS {order.amount?.toFixed(2)}
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Revenue</span>
            <span className="text-2xl font-bold text-green-700">
              GHS{" "}
              {orders
                .reduce((sum, order) => sum + (order.amount || 0), 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
