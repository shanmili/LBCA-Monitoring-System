import { Users, TrendingUp, BookOpen, AlertTriangle } from 'lucide-react';
import StatCard from './StatCard';
import '../../../styles/dashboard/KpiCards.css';

const KpiCards = ({ data, onNavigate }) => {
  const cards = [
    {
      title: 'Total Students',
      value: data.totalStudents,
      subtext: 'Enrolled this year',
      icon: Users,
      color: '#3B82F6',
      trend: 'up'  // Added trend
    },
    {
      title: 'Avg PACE Completion',
      value: `${data.avgPaceCompletion}%`,
      subtext: `${data.quarter} Progress`,
      icon: TrendingUp,
      color: '#10B981',
      trend: 'up'  // Added trend
    },
    {
      title: 'Behind PACE',
      value: data.behindPace,
      subtext: 'Students below target',
      icon: BookOpen,
      color: '#F59E0B',
      trend: 'down'  // Added trend
    },
    {
      title: 'At-Risk Students',
      value: data.atRisk,
      subtext: 'Click to View',
      icon: AlertTriangle,
      color: '#EF4444',
      trend: 'down',  // Added trend
      onClick: () => onNavigate('risk')
    }
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default KpiCards;