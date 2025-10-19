function ForecastCard({ day }) {
  // The API gives us a date like "2025-10-26 18:00:00". We just want the day of the week.
  const date = new Date(day.dt_txt);
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

  return (
    <div className="flex flex-col items-center p-3 bg-white/10 rounded-lg">
      <p className="font-semibold">{dayOfWeek}</p>
      <img src={iconUrl} alt={day.weather[0].description} className="w-12 h-12" />
      <p>{Math.round(day.main.temp)}°C</p>
    </div>
  );
}

export default ForecastCard;

