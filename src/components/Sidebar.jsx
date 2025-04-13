import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Drawer, Button, Avatar, Dropdown, Space } from 'antd';
import {
  DashboardOutlined,
  UserAddOutlined,
  FileTextOutlined,
  TeamOutlined,
  FileDoneOutlined,
  RiseOutlined,
  MenuOutlined,
  CloseOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileView, setMobileView] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setDrawerVisible(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => handleNavigation('/dashboard')
    },
    {
      key: 'adduser',
      icon: <UserAddOutlined />,
      label: 'Add User',
      onClick: () => handleNavigation('/adduser')
    },
    {
      key: 'accounts',
      icon: <TeamOutlined />,
      label: 'Accounts',
      onClick: () => handleNavigation('/accounts')
    },
    {
      key: 'quotation',
      icon: <RiseOutlined />,
      label: 'Quotation',
      onClick: () => handleNavigation('/quotation')
    },
    {
      key: 'invoice',
      icon: <FileDoneOutlined />,
      label: 'Invoices',
      onClick: () => handleNavigation('/invoice')
    },
    {
      key: 'bill',
      icon: <FileTextOutlined />,
      label: 'Bills',
      onClick: () => handleNavigation('/bill')
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileView) {
      setDrawerVisible(false);
    }
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
    navigate('/login');
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return ['dashboard'];
    if (path.includes('adduser')) return ['adduser'];
    if (path.includes('accounts')) return ['accounts'];
    if (path.includes('quotation')) return ['quotation'];
    if (path.includes('invoice')) return ['invoice'];
    if (path.includes('bill')) return ['bill'];
    return ['dashboard'];
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => navigate('/login')

    }
  ];

  const renderLogo = () => (
    <div style={{ 
      padding: '16px',
      fontWeight: 'bold',
      borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
    }}>
      <img
        src="src/assets/Primary Logo 01.png" 
        alt="Logo" 
        style={{ width: '100%', maxHeight: '50px' }} 
      />
    </div>
  );

  const renderUserPanel = () => (
    <div style={{
      padding: '16px',
      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
      marginTop: 'auto' // This pushes it to the bottom
    }}>
      <Dropdown 
        menu={{ items: userMenuItems }}
        placement="topRight"
        trigger={['click']}
      >
        <Button 
          type="text" 
          style={{ 
            textAlign: 'left',
            height: 'auto',
            padding: '8px'
          }}
        >
          <Space>
            <Avatar icon={<UserOutlined />} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 500 }}>John Doe</div>
              <div style={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}>Admin</div>
            </div>
          </Space>
        </Button>
      </Dropdown>
    </div>
  );

  if (mobileView) {
    return (
      <>
        <Button
          type="text"
          icon={drawerVisible ? <CloseOutlined /> : <MenuOutlined />}
          onClick={() => setDrawerVisible(!drawerVisible)}
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 999,
            width: 48,
            height: 48,
          }}
        />
        
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ 
            padding: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%' 
          }}
          width={250}
        >
          {renderLogo()}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Menu
              mode="inline"
              selectedKeys={getSelectedKey()}
              style={{ borderRight: 0 }}
              items={menuItems}
            />
          </div>
          {renderUserPanel()}
        </Drawer>
      </>
    );
  }

  return (
    <Sider
      width={180}
      style={{
        background: colorBgContainer,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {renderLogo()}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKey()}
          style={{ borderRight: 0 }}
          items={menuItems}
        />
      </div>
      {renderUserPanel()}
    </Sider>
  );
};

export default Sidebar;