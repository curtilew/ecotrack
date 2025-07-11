


const EntryCard = ({ log }) => {
  const date = new Date(log.createdAt).toDateString();
  
  // Get the main display info based on log type
  const getDisplayInfo = () => {
    if (log.activityType) {
      // Transportation
      return `${log.activityType} - ${log.distance || 0} miles`;
    } else if (log.energyType) {
      // Energy
      return `${log.energyType} - ${log.usage || 0} ${log.unit || ''}`;
    } else if (log.foodType) {
      // Food
      return `${log.foodType} - ${log.quantity || 0} ${log.unit || ''}`;
    } else if (log.category) {
      // Shopping
      return `${log.category} - ${log.itemName || 'Item'} ($${log.price || 0})`;
    }
    return 'Activity';
  };

  return (
    <div className="w-64 h-32 px-4 py-5 bg-white rounded-lg shadow flex flex-col justify-between">
      <div className="text-sm text-gray-500">{date}</div>
      <div className="font-medium truncate">{getDisplayInfo()}</div>
      {log.carbonFootprint && <div className="text-red-600">{log.carbonFootprint} kg CO₂</div>}
      {log.note && <div className="text-xs text-gray-400 truncate">{log.note}</div>}
    </div>
  );
};

export default EntryCard;