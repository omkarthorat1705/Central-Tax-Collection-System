import "./AdminLayout.css";

import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminLayout({ sidebar, pageTitle, children }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">{sidebar}</aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="page-title">{pageTitle}</div>

          <div className="header-right">
            <div>
              <div className="tenant-name">{user.tenant_name}</div>

              <div className="tenant-code">
                Authority Code: {user.tenant_code}
              </div>
            </div>

            <div>
              <div className="user-name">{user.full_name}</div>

              <div className="user-role">{user.role}</div>
            </div>

            <IconButton onClick={handleLogout} sx={{ color: "white" }}>
              <LogoutIcon />
            </IconButton>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
