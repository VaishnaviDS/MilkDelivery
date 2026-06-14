import { NavLink } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import "./layout.css";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAdmin();

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`admin-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div>
          <div className="sidebar-header">
            <h2 className="admin-sidebar-title">
              Milk Admin
            </h2>

            <button
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="admin-sidebar-nav">
            <NavLink
              to="/"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "admin-sidebar-link active"
                  : "admin-sidebar-link"
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/families"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "admin-sidebar-link active"
                  : "admin-sidebar-link"
              }
            >
              Families
            </NavLink>

            {/* <NavLink
              to="/entries"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "admin-sidebar-link active"
                  : "admin-sidebar-link"
              }
            >
              Daily Entry
            </NavLink> */}

            <NavLink
              to="/history"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "admin-sidebar-link active"
                  : "admin-sidebar-link"
              }
            >
              History
            </NavLink>

            <NavLink
              to="/invoice/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "admin-sidebar-link active"
                  : "admin-sidebar-link"
              }
            >
              Invoice Dashboard
            </NavLink>
          </nav>
        </div>

        <button
          onClick={logout}
          className="admin-sidebar-logout"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;