import { Clock } from 'lucide-react';
import '../../../styles/dashboard/ActivityFeed.css';

const ActivityFeed = ({ activities }) => {
  return (
    <aside className="activity-card">
      <h3 className="activity-title">Recent Activity</h3>
      <ul className="activity-list">
        {activities.map(activity => (
          <li key={activity.id} className="activity-item">
            <div className="activity-dot"></div>
            <div>
              <p className="activity-text">{activity.text}</p>
              <time className="activity-time">
                <Clock size={12} />
                {activity.time}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ActivityFeed;