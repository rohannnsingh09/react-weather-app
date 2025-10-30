function ForecastCard({ day, units }) {
  const date = new Date(day.dt_txt);
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });

  const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
  const tempUnit = units === 'metric' ? '°C' : '°F';
  
  // --- NEW: Get the Probability of Precipitation (POP) ---
  // The API gives POP as a number between 0 (0%) and 1 (100%).
  const chanceOfRain = day.pop ? Math.round(day.pop * 100) : 0; 

  return (
    <div className="flex flex-col items-center p-3 bg-white/10 rounded-lg">
      <p className="font-semibold text-sm">{dayOfWeek}</p>
      <img src={iconUrl} alt={day.weather[0].description} className="w-12 h-12" />
      <p className="font-bold">
        {Math.round(day.main.temp)}{tempUnit}
      </p>
      {/* --- NEW: Display the chance of rain if it's > 0% --- */}
      {chanceOfRain > 0 && (
        <p className="text-xs text-blue-300 mt-1">💧 {chanceOfRain}%</p>
      )}
      {/* --- End New POP Section --- */}
    </div>
  );
}

export default ForecastCard;