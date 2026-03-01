import React from 'react';
import SidebarItem from './SidebarItem';
import Logo from '../common/Logo';
import '../../styles/layout/Sidebar.css';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  AlertTriangle,
  Menu,
} from 'lucide-react';

const Sidebar = ({ isOpen, activeTab, onNavigate, onToggle, userRole = 'teacher', adminPhoto }) => {
  const isAdmin = userRole === 'admin';
  const isTeacher = userRole === 'teacher';

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <div className="sidebar-header">
        <button className="sidebar-toggle-btn" onClick={onToggle}>
          <Menu size={20} />
        </button>
        <Logo 
          adminPhoto={adminPhoto} 
          adminInitials={userRole === 'admin' ? 'AD' : 'TC'}
          showText={isOpen}
        />
      </div>
      
      <nav className="sidebar-menu">
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => onNavigate('dashboard')}
          collapsed={!isOpen} 
        />
        <SidebarItem 
          icon={Users} 
          label="Students" 
          active={activeTab === 'students'} 
          onClick={() => onNavigate('students')}
          collapsed={!isOpen} 
        />
        
        {isAdmin && (
          <SidebarItem 
            icon={Users} 
            label="Teachers" 
            active={activeTab === 'teachers'} 
            onClick={() => onNavigate('teachers')}
            collapsed={!isOpen} 
          />
        )}
        
        {isTeacher && (
          <SidebarItem 
            icon={GraduationCap} 
            label="PACE Progress" 
            active={activeTab === 'pace'} 
            onClick={() => onNavigate('pace')}
            collapsed={!isOpen} 
          />
        )}

        <SidebarItem 
          icon={AlertTriangle} 
          label="Early Warning" 
          active={activeTab === 'risk'} 
          onClick={() => onNavigate('risk')}
          collapsed={!isOpen} 
        />
      </nav>
    </aside>
  );
};

export default Sidebar;