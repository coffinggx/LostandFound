import "../css/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">Lost & Found</h2>

      <ul>
        <li className="active">Dashboard</li>
        <li>Browse Items</li>
        <li>Report Lost</li>
        <li>Report Found</li>
        <li>My Claims</li>
        <li>My Posts</li>
        <li>Profile</li>
        <li>Logout</li>
      </ul>
    </div>
  );
}

export default Sidebar;