// Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import {UserContext} from "./UserContext.jsx";
import { Button, Input } from "antd";
import {
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const Header = ({ collapsed, setCollapsed, colorBgContainer, onSearch  }) => {
  const {user} = useContext(UserContext);
  const handleSearchChange = (e) => {
    onSearch(e.target.value);  
  };
  return (
    <header
      className="p-3 flex items-center justify-between "
      style={{
        background: colorBgContainer,
        maxHeight: "64px"
      }}
    >
      <div className="flex gap-2 py-2">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      <div className="flex items-center bg-white rounded-full border border-gray-300 shadow-sm">
        <Input
          className="w-64 border-0 rounded-l-full"
          size="large"
          placeholder="Search..."
          prefix={<SearchOutlined className="text-gray-400" />}
          onChange={handleSearchChange}
        />
        <button className="bg-app_yellow text-white p-2 rounded-full h-8 w-8 flex items-center justify-center mr-1">
          <SearchOutlined />
        </button>
      </div>

      <Link
        to="/login"
        className="bg-app_blue flex items-center gap-2 border border-gray-300 rounded-full py-1.5 px-3 shadow-sm hover:opacity-90 h-12 max-w-[200px] "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-app_yellow"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>

        <div className="text-app_yellow">
          {!user ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          ) : (
            <div className="text-app_yellow">{user.name}</div>
          )}
        </div>
      </Link>
    </header>
  );
};

export default Header;
