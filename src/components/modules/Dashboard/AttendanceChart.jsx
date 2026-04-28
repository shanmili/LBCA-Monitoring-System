import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import '../../../styles/dashboard/AttendanceChart.css';

const AttendanceChart = ({ data }) => {
  const { chartData, overallPercentage } = data;

  return (
    <div className="chart-card">
      <h3 className="chart-title">Attendance</h3>
      <div className="pie-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="pie-center">
          <span className="pie-value">{overallPercentage}%</span>
          <span className="pie-label">Present</span>
        </div>
      </div>
      
      <div className="pie-legend">
        {chartData.map((item) => (
          <div className="legend-item" key={item.name}>
            <span className="legend-color" style={{ backgroundColor: item.color }}></span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceChart;