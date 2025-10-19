function UnitToggle({ units, onUnitChange }) {
  // We determine which button is "active" based on the `units` prop.
  const activeClass = "bg-white text-blue-600";
  const inactiveClass = "text-white/70 hover:bg-white/10";

  return (
    <div className="flex items-center justify-center bg-white/20 rounded-full p-1">
      <button
        onClick={() => onUnitChange('metric')}
        className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${units === 'metric' ? activeClass : inactiveClass}`}
      >
        °C
      </button>
      <button
        onClick={() => onUnitChange('imperial')}
        className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${units === 'imperial' ? activeClass : inactiveClass}`}
      >
        °F
      </button>
    </div>
  );
}

export default UnitToggle;
