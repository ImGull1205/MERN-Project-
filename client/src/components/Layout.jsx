import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import { Layout as AntLayout, theme } from "antd";

import Sider from "./Sider";
import Header from "./Header";

const { Content } = AntLayout;

export default function Layout({ onSearch }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <AntLayout className="min-h-screen">
      <AntLayout.Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Sider collapsed={collapsed} />
      </AntLayout.Sider>

      <AntLayout style={{ marginLeft: collapsed ? "80px" : "200px" }}>
        <AntLayout.Header
          style={{
            padding: 0,
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 999,
            width: "100%",
          }}
        >
          <Header
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            colorBgContainer={colorBgContainer}
            onSearch={onSearch}
          />
        </AntLayout.Header>

        <Content
          style={{
            margin: "16px",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: "calc(100vh - 80px)",
            overflow: "hidden",
          }}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
