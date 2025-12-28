import { Phone } from "lucide-react";

type RiderAssignedModalProps = {
  riderName: string;
  riderPhone: string;
  onHandedOver: () => void;
};

export function RiderAssignedModal({
  riderName,
  riderPhone,
  onHandedOver,
}: RiderAssignedModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 className="mb-6 text-center">Rider Assigned</h3>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Rider Name</p>
              <p className="">{riderName}</p>
            </div>
            <button
              onClick={() => (window.location.href = `tel:${riderPhone}`)}
              className="bg-green-600 text-white p-3 rounded-full"
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 text-sm">Phone</p>
          <p className="">{riderPhone}</p>
        </div>

        <button
          onClick={onHandedOver}
          className="w-full bg-green-600 text-white py-4 px-6 rounded-xl"
        >
          Package Handed Over
        </button>
      </div>
    </div>
  );
}
