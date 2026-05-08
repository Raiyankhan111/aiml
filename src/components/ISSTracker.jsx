import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import { useISSData } from '../hooks/useISSData';
import { RefreshCw, MapPin, Activity, Users } from 'lucide-react';
import L from 'leaflet';
import { useEffect } from 'react';
import ISSSpeedChart from '../charts/ISSSpeedChart';

// Fix leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Map center updater component
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function ISSTracker() {
  const { currentPosition, positions, speeds, astros, locationName, loading, refreshManual } = useISSData();

  const pathPositions = positions.map(p => [p.lat, p.lon]);
  const currentSpeed = speeds.length > 0 ? speeds[speeds.length - 1].speed : 0;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          Live ISS Tracking
          {loading && <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>}
        </h2>
        <button 
          onClick={refreshManual}
          className="flex items-center gap-2 text-sm bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors font-medium text-slate-700 dark:text-slate-300"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<MapPin size={20} className="text-blue-500" />} title="Location" value={locationName} />
        <StatCard icon={<Activity size={20} className="text-green-500" />} title="Speed" value={`${currentSpeed.toLocaleString()} km/h`} />
        <StatCard icon={<Users size={20} className="text-purple-500" />} title="Crew in Space" value={astros ? astros.number : '...'} />
        <StatCard icon={<RefreshCw size={20} className="text-amber-500" />} title="Coordinates" value={currentPosition ? `${currentPosition.lat.toFixed(2)}, ${currentPosition.lon.toFixed(2)}` : '...'} />
      </div>

      {/* Map */}
      <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 z-10 relative">
        {currentPosition ? (
          <MapContainer 
            center={[currentPosition.lat, currentPosition.lon]} 
            zoom={3} 
            scrollWheelZoom={false} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={[currentPosition.lat, currentPosition.lon]} />
            <Polyline positions={pathPositions} color="red" weight={3} dashArray="5, 10" />
            <Marker position={[currentPosition.lat, currentPosition.lon]}>
              <Tooltip permanent direction="top" offset={[0, -40]}>ISS</Tooltip>
            </Marker>
          </MapContainer>
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
            <span className="text-slate-500 dark:text-slate-400">Loading Map Data...</span>
          </div>
        )}
      </div>

      {/* Speed Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-semibold mb-4 dark:text-slate-200">Speed History (Last 30 updates)</h3>
        <ISSSpeedChart data={speeds} />
      </div>

      {/* Crew Panel */}
      {astros && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 dark:text-slate-200">People in Space</h3>
          <div className="flex flex-wrap gap-3">
            {astros.people.map((person, idx) => (
              <div key={idx} className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-sm font-medium dark:text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                {person.name} ({person.craft})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-start gap-4 transition-all hover:shadow-md">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px]" title={value}>{value}</p>
      </div>
    </div>
  );
}
