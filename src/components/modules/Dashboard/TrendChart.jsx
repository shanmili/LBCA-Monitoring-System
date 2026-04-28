import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import '../../../styles/dashboard/TrendChart.css';

const TrendChart = ({ data, title = "PACE Completion Trend" }) => {

  if (!data || data.length === 0) {
    return (
      <div className="chart-card"> 
        <h3 className="chart-title">{title}</h3>
        <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card"> 
      <h3 className="chart-title">{title}</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="#9CA3AF" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="SectionA" 
              stroke="#1F4788" 
              strokeWidth={3} 
              name="Section A" 
            />
            <Line 
              type="monotone" 
              dataKey="SectionB" 
              stroke="#F59E0B" 
              strokeWidth={3} 
              name="Section B" 
            />
            <Line 
              type="monotone" 
              dataKey="SectionC" 
              stroke="#10B981" 
              strokeWidth={3} 
              name="Section C" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;