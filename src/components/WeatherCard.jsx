import DaylightArc from './DaylightArc';

function WeatherCard({ weatherData, units, isLocationBased }) {
  if (!weatherData) {
    return null;
  }
  
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const windUnit = units === 'metric' ? 'm/s' : 'mph';

  // Destructure more data, including the main condition and potential rain volume
  const { name, main, weather, wind, rain } = weatherData;
  const mainCondition = weather[0].main; // e.g., "Rain", "Clouds", "Clear"
  const description = weather[0].description;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  // --- NEW: Check for recent rain volume (API provides it in '1h' or '3h') ---
  const rainVolume = rain ? (rain['1h'] || rain['3h'] || null) : null;

  return (
    <div className="p-6 bg-white/20 backdrop-blur-md rounded-xl shadow-lg text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold">
          {isLocationBased ? 'Your Current Location' : name}
        </h2>
        <p className="text-6xl font-light mt-4 mb-2">
          {Math.round(main.temp)}{tempUnit}
        </p>
        <div className="flex items-center justify-center">
          <img src={iconUrl} alt={description} className="w-20 h-20 -ml-4" /> 
          <p className="text-2xl capitalize ml-2">{description}</p>
        </div>
        
        {/* --- NEW: Explicitly show if it's raining --- */}
        {/* --- NEW, SMARTER RAIN/STORM LOGIC --- */}

{/* First, check for a Thunderstorm */}
{(mainCondition === 'Thunderstorm') && (
  <p className="text-yellow-300 mt-2 font-semibold">
    Thunderstorm Active
    {rainVolume && ` (${rainVolume}mm recently)`} 
  </p>
)}

{/* THEN, check for normal Rain or Drizzle */}
{(mainCondition === 'Rain' || mainCondition === 'Drizzle') && (
  <p className="text-blue-300 mt-2 font-semibold">
    Currently Raining 
    {rainVolume && ` (${rainVolume}mm recently)`} 
  </p>
)}

{/* --- END OF NEW LOGIC --- */}
        {/* --- End New Rain Section --- */}

      </div>

      {/* Details Section */}
      <div className="mt-8 border-t border-white/30 pt-6 text-lg">
         <div className="flex justify-between mb-2">
          <span>Feels Like</span>
          <span className="font-semibold">{Math.round(main.feels_like)}{tempUnit}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Humidity</span>
          <span className="font-semibold">{main.humidity}%</span>
        </div>
        <div className="flex justify-between">
          <span>Wind Speed</span>
          <span className="font-semibold">{wind.speed} {windUnit}</span>
        </div>
      </div>
      
      <DaylightArc weatherData={weatherData} />
    </div>
  );
}

export default WeatherCard;