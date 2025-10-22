import { CheckCircle, Clock, Swords, Trophy, XCircle, Zap } from "lucide-react";

export default function InviteNotification({ invite, onAccept, onDecline }){
  return (
    <div className="fixed top-4 right-4 bg-gray-10 border border-purple-60 rounded-lg p-4 max-w-sm shadow-lg z-50 animate-slide-in">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-60 flex items-center justify-center flex-shrink-0">
          <Swords className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-white-99 font-semibold mb-1">
            Battle Invitation
          </h4>
          <p className="text-gray-50 text-sm mb-3">
            <span className="text-white-95 font-medium">{invite.senderUsername}</span> wants to battle!
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-50 mb-3">
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              {invite.gameSettings?.xp || 50} XP
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {Math.floor((invite.gameSettings?.timeLimit || 600) / 60)}m
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {invite.gameSettings?.difficulty || 'medium'}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onAccept(invite.id)}
              className="flex-1 px-3 py-2 bg-purple-60 text-white rounded text-sm font-medium hover:bg-purple-65 transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle className="w-4 h-4" />
              Accept
            </button>
            <button
              onClick={() => onDecline(invite.id)}
              className="flex-1 px-3 py-2 bg-gray-15 text-white-95 rounded text-sm hover:bg-gray-20 transition-colors flex items-center justify-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};