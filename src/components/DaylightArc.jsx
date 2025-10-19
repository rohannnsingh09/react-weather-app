// This component visualizes the sun's position between sunrise and sunset.
function DaylightArc({ weatherData }) {
  // We get the specific data we need: sunrise, sunset, and the current time for that city.
  const { sunrise, sunset } = weatherData.sys;
  const currentTime = weatherData.dt;
  const timezone = weatherData.timezone;

  // The API gives us time in "UNIX seconds". We need to convert it to milliseconds for JavaScript.
  const sunriseTime = new Date((sunrise + timezone) * 1000);
  const sunsetTime = new Date((sunset + timezone) * 1000);
  const currentTimeUTC = new Date((currentTime + timezone) * 1000);

  // --- The Logic for the Arc ---
  // 1. Calculate the total duration of daylight in milliseconds.
  const totalDaylight = sunsetTime.getTime() - sunriseTime.getTime();
  // 2. Calculate how much time has passed since sunrise.
  const elapsedTime = currentTimeUTC.getTime() - sunriseTime.getTime();
  // 3. Calculate the sun's position as a percentage (0% at sunrise, 100% at sunset).
  let sunPositionPercent = (elapsedTime / totalDaylight) * 100;

  // We "clamp" the value between 0 and 100 so the sun doesn't go off the arc.
  sunPositionPercent = Math.max(0, Math.min(100, sunPositionPercent));
  
  // Convert the percentage to an angle for our SVG arc. The arc goes from -90deg to +90deg.
  const angle = (sunPositionPercent / 100) * 180 - 90;
  const x = 50 + 40 * Math.cos(angle * (Math.PI / 180));
  const y = 50 + 40 * Math.sin(angle * (Math.PI / 180));

  // --- Formatting the Times for Display ---
  // We format the sunrise and sunset times to be easily readable (e.g., "6:30 AM").
  const options = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'UTC' };
  const formattedSunrise = sunriseTime.toLocaleTimeString('en-US', options);
  const formattedSunset = sunsetTime.toLocaleTimeString('en-US', options);

  return (
    <div className="mt-12 border-t border-white/30 pt-6">
      <h3 className="text-xl font-bold text-white mb-4">Sunrise & Sunset</h3>
      <div className="relative w-full h-24">
        {/* This is the SVG canvas where we draw our arc and sun */}
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          {/* This is the gray background arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="4"
          />
          {/* This is the sun icon. We move it along the arc using the calculated x and y values. */}
          <g transform={`translate(${x}, ${y})`}>
             <circle cx="0" cy="0" r="4" fill="#FFD700" />
          </g>
        </svg>
      </div>
      <div className="flex justify-between text-white mt-2">
        <div className="text-center">
          <p className="font-semibold">{formattedSunrise}</p>
          <p className="text-sm opacity-70">Sunrise</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">{formattedSunset}</p>
          <p className="text-sm opacity-70">Sunset</p>
        </div>
      </div>
    </div>
  );
}

export default DaylightArc;
