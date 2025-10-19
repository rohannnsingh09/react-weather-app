// --- STEP 1: IMPORT EVERYTHING WE NEED ---
import { useState, useEffect } from 'react'; // <-- Import useEffect
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import HourlyChart from './components/HourlyChart';
import UnitToggle from './components/UnitToggle'; // <-- Import our new toggle

// --- REMEMBER TO PASTE YOUR API KEY HERE ---
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function App() {
  // --- STEP 2: SET UP STATE ---
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [fullForecast, setFullForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bgClass, setBgClass] = useState('from-gray-700 to-gray-900');
  // --- NEW: State to remember the units ('metric' for C, 'imperial' for F) ---
  const [units, setUnits] = useState('metric'); 

  // --- NEW: This useEffect hook will re-fetch data whenever the units change ---
  useEffect(() => {
    // We only re-fetch if there is already weather data displayed.
    if (weatherData) {
      // We need a city name to re-fetch, which we can get from the current weather data.
      const currentCity = weatherData.name;
      searchWeather(null, currentCity); // Re-run search with the new units and current city
    }
    // Note: No 'weatherData' in dependency array to avoid loop on initial load
  }, [units]); // The magic: this [] array tells React to run this code ONLY when `units` changes.

  const getBackgroundClass = (weather) => {
    // ... (this function stays the same)
    if (!weather) return 'from-gray-700 to-gray-900';
    const condition = weather.toLowerCase();
    if (condition.includes('clear')) return 'from-blue-400 to-blue-600';
    if (condition.includes('clouds')) return 'from-gray-500 to-gray-700';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'from-slate-600 to-slate-800';
    if (condition.includes('thunderstorm')) return 'from-indigo-800 to-gray-900';
    if (condition.includes('snow')) return 'from-sky-300 to-sky-500';
    if (condition.includes('haze') || condition.includes('mist') || condition.includes('fog')) return 'from-gray-400 to-gray-600';
    return 'from-gray-700 to-gray-900';
  };

  // --- We've updated the search function to accept a city name directly ---
  const searchWeather = async (e, cityOverride) => {
    if(e) e.preventDefault(); 
    
    // Use the city from the state, or the one passed in (for useEffect re-fetch)
    const searchCity = cityOverride || city; 
    if (!searchCity) return setError("Please enter a city name to search.");

    setLoading(true);
    setError(null);
    // Don't clear weatherData here, as useEffect might be re-fetching
    
    try {
      // --- The `units` state variable is now used in the API URLs ---
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=${units}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&units=${units}`;
      
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);

      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json();
        throw new Error(errorData.message || 'City not found.');
      }
      if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json();
        throw new Error(errorData.message || 'Could not fetch forecast.');
      }

      const weatherDataJson = await weatherResponse.json();
      const forecastDataJson = await forecastResponse.json();
      
      setWeatherData(weatherDataJson);
      setFullForecast(forecastDataJson);
      const dailyForecasts = forecastDataJson.list.filter(reading => reading.dt_txt.includes("12:00:00"));
      setForecastData(dailyForecasts);
      
      const newBg = getBackgroundClass(weatherDataJson.weather[0].main);
      setBgClass(newBg);
      
    } catch (err) {
      setError(err.message);
      setBgClass('from-red-500 to-red-700');
       // Clear data on error
      setWeatherData(null);
      setForecastData(null);
      setFullForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeatherByCoords(latitude, longitude);
        },
        () => {
          setError("Location access was denied.");
          setBgClass('from-red-500 to-red-700');
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setBgClass('from-red-500 to-red-700');
    }
  };
  
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      // --- The `units` state variable is now used in the API URLs ---
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;

      // ... (rest of the function is the same, just setting the state)
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);
      const weatherDataJson = await weatherResponse.json();
      const forecastDataJson = await forecastResponse.json();

      if (weatherResponse.ok && forecastResponse.ok) {
        setWeatherData(weatherDataJson);
        setFullForecast(forecastDataJson);
        const dailyForecasts = forecastDataJson.list.filter(reading => reading.dt_txt.includes("12:00:00"));
        setForecastData(dailyForecasts);
        const newBg = getBackgroundClass(weatherDataJson.weather[0].main);
        setBgClass(newBg);
        setCity(weatherDataJson.name);
      } else {
        setError('Could not fetch weather data for your location.');
        setBgClass('from-red-500 to-red-700');
      }
    } catch (err) {
      setError('An error occurred while fetching data by location.');
      setBgClass('from-red-500 to-red-700');
    } finally {
      setLoading(false);
    }
  };

  // --- NEW: Function to handle the unit change ---
  const handleUnitChange = (newUnit) => {
    setUnits(newUnit); // Just update the state. The useEffect will handle re-fetching.
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-700 bg-gradient-to-br ${bgClass}`}>
      <div className="w-full max-w-md p-4 sm:p-8">
        {/* --- We put the title and toggle side-by-side --- */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-white">
            Weather App
          </h1>
          {/* --- Render the UnitToggle, passing the current unit and the change handler --- */}
          <UnitToggle units={units} onUnitChange={handleUnitChange} />
        </div>
        
        <form onSubmit={searchWeather} className="relative flex items-center gap-2">
          {/* ... (input and buttons are the same) ... */}
           <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter a city..."
            className="w-full p-3 pl-10 bg-white/20 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="button" onClick={handleLocationClick} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white" title="Use my location">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L12 2A9 9 0 0 1 21 11L21 11"/><path d="M2 12L2 12A9 9 0 0 1 13 3L13 3"/><path d="M12 22L12 22A9 9 0 0 0 3 13L3 13"/><path d="M22 12L22 12A9 9 0 0 0 11 3L11 3"/><circle cx="12" cy="12" r="1"/></svg>
          </button>
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-500">
            {loading ? '...' : 'Search'}
          </button>
        </form>
        <div className="mt-8"></div>
        {loading && <LoadingSpinner />}
        <ErrorMessage message={error} />

        {!loading && !error && weatherData && (
          <div className="animate-fade-in">
            {/* --- We now pass the `units` state down to our display components --- */}
            <WeatherCard weatherData={weatherData} units={units} />
            {fullForecast && <HourlyChart forecastData={fullForecast} />} 
            {forecastData && forecastData.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">5-Day Forecast</h3>
                <div className="grid grid-cols-5 gap-2 text-white text-center">
                  {forecastData.map((day, index) => (
                    // --- Pass units down to ForecastCard too ---
                    <ForecastCard key={index} day={day} units={units} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;