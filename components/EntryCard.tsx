


const EntryCard = ({ log }) => {
  // const date = new Date(log.createdAt).toDateString();
  
  // Get the main display info and theme based on log type
  const getDisplayInfo = () => {
    if (log.activityType) {
      // Transportation
      return {
        title: 'Transportation',
        detail: `${log.activityType} - ${log.distance || 0} miles`,
        bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
        borderColor: 'border-emerald-200',
        badgeColor: 'bg-emerald-500',
        textColor: 'text-emerald-800'
      };
    } else if (log.energyType) {
      // Energy
      return {
        title: 'Energy',
        detail: `${log.energyType} - ${log.usage || 0} ${log.unit || ''}`,
        bgColor: 'bg-gradient-to-br from-emerald-50 to-green-100',
        borderColor: 'border-emerald-200',
        badgeColor: 'bg-emerald-600',
        textColor: 'text-emerald-800'
      };
    } else if (log.foodType) {
      // Food
      return {
        title: 'Food',
        detail: `${log.foodType} - ${log.quantity || 0} ${log.unit || ''}`,
        bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
        borderColor: 'border-emerald-200',
        badgeColor: 'bg-emerald-700',
        textColor: 'text-emerald-800'
      };
    } else if (log.category) {
      // Shopping
      return {
        title: 'Shopping',
        detail: `${log.category} - ${log.itemName || 'Item'} (${log.price || 0})`,
        bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
        borderColor: 'border-emerald-200',
        badgeColor: 'bg-emerald-800',
        textColor: 'text-emerald-800'
      };
    }
    return {
      title: 'Activity',
      detail: 'Activity',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      badgeColor: 'bg-emerald-500',
      textColor: 'text-emerald-800'
    };
  };

  const info = getDisplayInfo();

  return (
    <div className={`w-72 h-36 p-5 rounded-xl shadow-lg border-2 ${info.bgColor} ${info.borderColor} hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col justify-between`}>
      {/* Header with badge and date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${info.badgeColor}`}></div>
          <span className={`text-xs font-medium ${info.textColor} uppercase tracking-wide`}>
            {info.title}
          </span>
        </div>
        <div className="text-xs text-emerald-600 font-medium">
          {new Date(log.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center">
        <div className={`font-semibold text-base ${info.textColor} truncate leading-tight`}>
          {info.detail}
        </div>
        
        {/* Carbon footprint display */}
        {log.carbonFootprint && (
          <div className="mt-2 text-xs text-emerald-700 font-medium">
            {log.carbonFootprint} kg CO₂
          </div>
        )}
      </div>

      {/* Note section */}
      {log.note && (
        <div className="mt-3 pt-3 border-t border-emerald-200">
          <div className="text-xs text-emerald-600 italic truncate">
            `{log.note}`
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryCard;