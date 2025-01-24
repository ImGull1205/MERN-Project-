import React from "react";
import { Menu } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext.jsx";
import axios from "axios";
import {
  FieldTimeOutlined,
  QuestionCircleOutlined,
  ShopOutlined,
  LogoutOutlined,
  HomeOutlined
} from "@ant-design/icons";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const Sider = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);

  // Get current selected key based on path
  const getSelectedKey = (pathname) => {
    switch (pathname) {
      case '/':
        return '1';
      case '/myplaces':
        return '3';
      case '/bookings':
        return '4';
      default:
        return '1';
    }
  };

  const handleLogout = () => {
    axios.post('/api/logout').then(() => {
      setTimeout(() => {
        setUser(null);
        window.location.href = '/';
      }, 1000);
    }).catch((error) => {
      console.error('Logout failed:', error);
    });
  };

  const mainMenuItems = [
    getItem(
      <Link to="/" className="flex items-center gap-2 hover:opacity-90">
        Homepage
      </Link>,
      "1", 
      <HomeOutlined className="text-lg" />
    ),
    ...(user ? [
      getItem(<Link to="/myplaces" className="flex items-center gap-2 hover:opacity-90">
        My Places  
      </Link>,
      "3", 
      <ShopOutlined className="text-lg" />),
      getItem(
        <Link to="/bookings" className="flex items-center gap-2 hover:opacity-90">
          Booking History 
        </Link>,
        "4", 
        <FieldTimeOutlined className="text-lg" />
      )
    ] : [])
  ];

  const settingsMenuItems = [
    getItem("About Us", "About Us", <QuestionCircleOutlined className="text-lg" />),
    ...(user ? [getItem("Logout", "logout", <LogoutOutlined className="text-lg" />)] : []),
  ];

  return (
    <div className="flex flex-col h-full p-2.5">
      <div className={`p-2 ${collapsed ? "flex justify-center" : ""}`}>
        <a href="/" className="bg-app_blue rounded-full py-2.5 px-4 inline-flex items-center gap-3 w-full justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-app_yellow shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
          </svg>
          {!collapsed && (
            <span className="text-app_yellow font-bold text-base flex-1 text-center">
              SUNSHINE
            </span>
          )}
        </a>
      </div>

      <div className="mt-10">
        <div className="px-3 text-white font-bold text-lg text-center mb-3">
          {collapsed ? null : "Menu"}
        </div>
        <Menu
          className="border-none bg-transparent"
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey(location.pathname)]}
          items={mainMenuItems}
        />
      </div>

      <div className="mt-auto pb-5">
        <Menu
          className="border-none bg-transparent"
          theme="dark"
          mode="inline"
          items={settingsMenuItems}
          onClick={({ key }) => {
            if (key === 'logout' && user) {
              handleLogout();
            }
          }}
        />
      </div>
    </div>
  );
};

export default Sider;