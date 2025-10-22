import { Clock } from "lucide-react";

export default function SentInvitesList ({ invites, onCancel }) {
  if (invites.length === 0) return null;

  return (
    <div className="bg-gray-10 border border-gray-20 rounded-lg p-4">
      <h3 className="text-white-99 font-semibold mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-purple-60" />
        Pending Invites
      </h3>
      
      <div className="space-y-2">
        {invites.map(invite => (
          <div 
            key={invite.id}
            className="flex items-center justify-between p-3 bg-gray-15 rounded-lg"
          >
            <div>
              <p className="text-white-95 text-sm font-medium">
                {invite.receiverUsername}
              </p>
              <p className="text-gray-50 text-xs">
                Waiting for response...
              </p>
            </div>
            
            <button
              onClick={() => onCancel(invite.id)}
              className="px-3 py-1 text-sm text-gray-50 hover:text-white-99 transition-colors"
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};