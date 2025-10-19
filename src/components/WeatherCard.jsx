// --- We import the DaylightArc component ---
import DaylightArc from './DaylightArc';

// --- We've updated the function to accept a `units` prop ---
function WeatherCard({ weatherData, units }) {
  // Guard clause remains the same
  if (!weatherData) {
    return null;
  }
  
  // --- We determine the correct symbols based on the units ---
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const windUnit = units === 'metric' ? 'm/s' : 'mph';

  const { name, main, weather, wind } = weatherData;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  return (
    <div className="p-6 bg-white/20 backdrop-blur-md rounded-xl shadow-lg text-white">
      {/* Main weather info section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold">{name}</h2>
        <p className="text-6xl font-light mt-4 mb-2">
          {/* We now use our dynamic tempUnit variable */}
          {Math.round(main.temp)}{tempUnit}
        </p>
        <div className="flex items-center justify-center">
          <img src={iconUrl} alt={weather[0].description} className="w-20 h-20" />
          <p className="text-2xl capitalize">{weather[0].description}</p>
        </div>
      </div>

      {/* Details section */}
      <div className="mt-8 border-t border-white/30 pt-6 text-lg">
        <div className="flex justify-between mb-2">
          <span>Feels Like</span>
          {/* Use dynamic tempUnit */}
          <span className="font-semibold">{Math.round(main.feels_like)}{tempUnit}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Humidity</span>
          <span className="font-semibold">{main.humidity}%</span>
        </div>
        <div className="flex justify-between">
          <span>Wind Speed</span>
          {/* Use dynamic windUnit */}
          <span className="font-semibold">{wind.speed} {windUnit}</span>
        </div>
      </div>
      
      {/* Daylight Arc component remains the same */}
      <DaylightArc weatherData={weatherData} />
    </div>
  );
}

export default WeatherCard;