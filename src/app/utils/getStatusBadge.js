export default function getStatusBadge (status) {
  const badges = {
    online: { color: 'bg-green-500', text: 'Online', pulse: true },
    offline: { color: 'bg-gray-40', text: 'Offline', pulse: false },
    away: { color: 'bg-yellow-500', text: 'Away', pulse: false },
    busy: { color: 'bg-red-500', text: 'Busy', pulse: false }
  };
  return badges[status] || badges.offline;
};