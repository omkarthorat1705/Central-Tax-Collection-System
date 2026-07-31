import { NavLink } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentsIcon from "@mui/icons-material/Payments";
import SettingsIcon from "@mui/icons-material/Settings";
import RuleIcon from "@mui/icons-material/Rule";
import TuneIcon from "@mui/icons-material/Tune";
import AnalyticsIcon from "@mui/icons-material/Analytics";

const menus = [
  {
    title: "Dashboard",
    path: "/admin-dashboard",
    icon: <DashboardIcon />,
  },
  {
    title: "Citizens",
    path: "/citizens",
    icon: <PeopleIcon />,
  },
  {
    title: "Assets",
    path: "/assets",
    icon: <HomeWorkIcon />,
  },
  {
    title: "Assessments",
    path: "/assessments",
    icon: <ReceiptLongIcon />,
  },
  {
    title: "Payments",
    path: "/payments",
    icon: <PaymentsIcon />,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: <AnalyticsIcon />,
  },
  {
    title: "Tax Configuration",
    path: "/tax-types",
    icon: <RuleIcon />,
  },
  {
    title: "Parameters",
    path: "/parameters",
    icon: <TuneIcon />,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <SettingsIcon />,
  },
];

export default function AdminSidebar() {
  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img
          src="/ctcs-logo.png"
          alt="CTCS"
          className="sidebar-logo-image"
        />
      </div>

      <div className="sidebar-menu">
        {menus.map((menu) => (
          <NavLink
            key={menu.title}
            to={menu.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            {menu.icon}

            <span>{menu.title}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}