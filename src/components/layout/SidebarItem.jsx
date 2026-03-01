const SidebarItem = ({ icon: Icon, label, active, collapsed, onClick }) => {
  return (
    <button
      className={`sidebar-item ${active ? 'active' : ''}`}
      onClick={onClick}
      data-label={label}
      title={collapsed ? label : undefined}
    >
      <Icon size={20} />
      <span className={collapsed ? 'hidden' : ''}>{label}</span>
    </button>
  );
};

export default SidebarItem;