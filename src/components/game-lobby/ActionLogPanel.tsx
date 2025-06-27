import React from "react";

interface ActionLogEntry {
  player: string;
  action: string;
  amount?: number;
  timestamp: number;
  handNumber?: number;
  hand?: string;
  blindType?: string;
}

interface ActionLogPanelProps {
  log: ActionLogEntry[];
  currentUser?: string;
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const actionMeta = (entry: ActionLogEntry, currentUser?: string) => {
  const isYou = entry.player === currentUser;
  switch (entry.action) {
    case "fold":
      return { icon: "🚫", color: "text-red-400", text: `${isYou ? "You" : entry.player} folded` };
    case "call":
      return { icon: "🟢", color: "text-green-400", text: `${isYou ? "You" : entry.player} called${entry.amount ? ` ${entry.amount}` : ""}` };
    case "all-in":
      return { icon: "🟡", color: "text-yellow-300", text: `${isYou ? "You" : entry.player} went all-in${entry.amount ? ` (${entry.amount})` : ""}` };
    case "check":
      return { icon: "⚪", color: "text-gray-200", text: `${isYou ? "You" : entry.player} checked` };
    case "bet":
      return { icon: "🔵", color: "text-blue-400", text: `${isYou ? "You" : entry.player} bet${entry.amount ? ` ${entry.amount}` : ""}` };
    case "hand-start":
      return { icon: "🆕", color: "text-teal-300", text: `New hand started${entry.handNumber ? ` (#${entry.handNumber})` : ""}` };
    case "hand-end":
      return { icon: "🏁", color: "text-teal-200", text: `Hand ended${entry.handNumber ? ` (#${entry.handNumber})` : ""}` };
    case "showdown":
      return { icon: "👑", color: "text-yellow-400", text: `${entry.player} wins with ${entry.hand}${entry.amount ? ` (${entry.amount})` : ""}` };
    case "blind-posted":
      return { icon: "💰", color: "text-pink-300", text: `${entry.player} posted ${entry.blindType} blind${entry.amount ? ` (${entry.amount})` : ""}` };
    case "pot-won":
      return { icon: "🏆", color: "text-green-300", text: `${entry.player === currentUser ? "You" : entry.player} won the pot${entry.amount ? `: ${entry.amount}` : ""}` };
    default:
      return { icon: "•", color: "text-white", text: `${isYou ? "You" : entry.player} performed ${entry.action}${entry.amount ? ` (${entry.amount})` : ""}` };
  }
};

const ActionLogPanel: React.FC<ActionLogPanelProps> = ({ log, currentUser }) => (
  <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 rounded-lg shadow-lg p-2 h-40 overflow-y-auto text-xs text-white">
    <div className="font-bold text-teal-300 mb-2">Action Log</div>
    <ul className="space-y-1">
      {log.slice(-20).map((entry, idx) => {
        const { icon, color, text } = actionMeta(entry, currentUser);
        return (
          <li
            key={entry.timestamp + '-' + idx}
            className={`flex items-center gap-2 animate-fade-in ${color} ${entry.player === currentUser ? 'font-bold' : ''}`}
            style={{ animationDelay: `${idx * 0.03}s` }}
          >
            <span className="text-base leading-none">{icon}</span>
            <span>{text}</span>
            <span className="ml-auto text-gray-400 text-[10px] tabular-nums">{formatTime(entry.timestamp)}</span>
          </li>
        );
      })}
    </ul>
    <style>{`
      @keyframes fade-in { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: none; } }
      .animate-fade-in { animation: fade-in 0.4s ease; }
    `}</style>
  </div>
);

export default ActionLogPanel; 