export default function ServerStatusBadge({isOffline} : {isOffline : boolean}) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
      isOffline 
        ? "bg-gray-50 border-gray-200 text-gray-500" 
        : "bg-green-50 border-green-100 text-green-700"
    }`}>
      <span className={`w-2 h-2 rounded-full ${
        isOffline ? "bg-gray-400" : "bg-green-500 animate-pulse"
      }`} />
      <span className="text-xs font-bold uppercase tracking-wider">
        {isOffline ? "Offline" : "Live"}
      </span>
    </div>
  )
}
