// We need to import the specific chart-building tools from the recharts library.
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function HourlyChart({ forecastData }) {
  // The forecast data from the API includes the full 5-day, 3-hour forecast.
  // We only want the next 8 entries (which is 24 hours).
  const hourlyData = forecastData.list.slice(0, 8).map(item => {
    return {
      // We format the time to be readable, e.g., "9 PM"
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
      // We round the temperature.
      temp: Math.round(item.main.temp),
    };
  });

  // This is a custom component for the tooltip that appears when you hover over the chart.
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white/30 backdrop-blur-sm rounded-md border border-white/20">
          <p className="text-white">{`${payload[0].value}°C`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-white mb-4">Next 24 Hours</h3>
      {/* ResponsiveContainer makes the chart automatically fit its parent container. */}
      <div style={{ width: '100%', height: 150 }}>
        <ResponsiveContainer>
          <LineChart data={hourlyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            {/* XAxis is the horizontal line (our time). */}
            <XAxis dataKey="time" tick={{ fill: 'white' }} axisLine={false} tickLine={false} />
            {/* YAxis is the vertical line (our temperature). We don't need to show it. */}
            <YAxis hide={true} domain={['dataMin - 2', 'dataMax + 2']} />
            {/* Tooltip is what appears when you hover. We use our custom one. */}
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }} />
            {/* Line is what draws the actual line on the chart. */}
            <Line type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HourlyChart;
