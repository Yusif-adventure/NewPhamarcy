import { Loader2, CheckCircle } from "lucide-react";

type Order = {
  id: string;
  status: string;
  riderName?: string;
  riderPhone?: string;
};

type SearchingRiderModalProps = {
  order: Order;
  onClose: () => void;
};

export function SearchingRiderModal({
  order,
  onClose,
}: SearchingRiderModalProps) {
  const isFound = order.status === "out-for-delivery";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
        {!isFound ? (
          <div className="py-8">
            <div className="flex justify-center mb-4">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Searching for Rider</h3>
            <p className="text-gray-500">
              Please wait while we find a nearby rider for your delivery...
            </p>
          </div>
        ) : (
          <div className="py-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Rider Found!</h3>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-gray-500 mb-1">Rider Name</p>
              <p className="font-semibold mb-3">{order.riderName}</p>
              <p className="text-sm text-gray-500 mb-1">Phone Number</p>
              <p className="font-semibold">{order.riderPhone}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
