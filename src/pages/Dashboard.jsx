import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Space, Divider, Select } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined, 
  FileDoneOutlined, 
  MoneyCollectOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  // Sample data - replace with actual API calls in a real application
  const [dashboardData, setDashboardData] = useState({
    users: {
      total: 42,
      active: 35,
      inactive: 7
    },
    accounts: {
      total: 28,
      active: 22,
      inactive: 6
    },
    quotations: {
      total: 156,
      recent: [
        { id: 'QTN-2023-0156', company: 'ABC Constructions', amount: '₹28,500' },
        { id: 'QTN-2023-0155', company: 'XYZ Builders', amount: '₹42,300' },
        { id: 'QTN-2023-0154', company: 'PQR Developers', amount: '₹15,750' }
      ]
    },
    invoices: {
      total: 89,
      paid: 67,
      unpaid: 22,
      recent: [
        { id: 'INV-2023-0089', client: 'ABC Constructions', amount: '₹18,500', status: 'Paid' },
        { id: 'INV-2023-0088', client: 'LMN Associates', amount: '₹32,000', status: 'Unpaid' }
      ]
    },
    bills: {
      total: 76,
      paid: 58,
      unpaid: 18
    }
  });

  // Chart data
  const accountStatusData = {
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [dashboardData.accounts.active, dashboardData.accounts.inactive],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const monthlyRevenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (in ₹)',
        data: [125000, 190000, 150000, 210000, 180000, 230000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const quotationColumns = [
    {
      title: 'Quotation ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  const invoiceColumns = [
    {
      title: 'Invoice ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'Paid' ? '#52c41a' : '#f5222d' }}>
          {status}
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1>Dashboard</h1>
      
      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={dashboardData.users.total}
              prefix={<UserOutlined />}
            />
            <div style={{ marginTop: '8px' }}>
              <Space>
                <span style={{ color: '#52c41a' }}>
                  <ArrowUpOutlined /> {dashboardData.users.active} Active
                </span>
                <span style={{ color: '#f5222d' }}>
                  <ArrowDownOutlined /> {dashboardData.users.inactive} Inactive
                </span>
              </Space>
            </div>
          </Card>
        </Col>
        
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Accounts"
              value={dashboardData.accounts.total}
              prefix={<UserOutlined />}
            />
            <div style={{ marginTop: '8px' }}>
              <Space>
                <span style={{ color: '#52c41a' }}>
                  <ArrowUpOutlined /> {dashboardData.accounts.active} Active
                </span>
                <span style={{ color: '#f5222d' }}>
                  <ArrowDownOutlined /> {dashboardData.accounts.inactive} Inactive
                </span>
              </Space>
            </div>
          </Card>
        </Col>
        
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Quotations"
              value={dashboardData.quotations.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Invoices"
              value={dashboardData.invoices.total}
              prefix={<FileDoneOutlined />}
            />
            <div style={{ marginTop: '8px' }}>
              <Space>
                <span style={{ color: '#52c41a' }}>
                  <ArrowUpOutlined /> {dashboardData.invoices.paid} Paid
                </span>
                <span style={{ color: '#f5222d' }}>
                  <ArrowDownOutlined /> {dashboardData.invoices.unpaid} Unpaid
                </span>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card title="Account Status">
            <div style={{ height: '300px' }}>
              <Pie data={accountStatusData} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Monthly Revenue">
            <div style={{ height: '300px' }}>
              <Bar data={monthlyRevenueData} options={{ maintainAspectRatio: false }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Row */}
      <Row gutter={16}>
        <Col span={12}>
          <Card 
            title="Recent Quotations" 
            extra={<Select defaultValue="week" style={{ width: 120 }}>
              <Select.Option value="week">This Week</Select.Option>
              <Select.Option value="month">This Month</Select.Option>
              <Select.Option value="year">This Year</Select.Option>
            </Select>}
          >
            <Table 
              columns={quotationColumns} 
              dataSource={dashboardData.quotations.recent} 
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title="Recent Invoices"
            extra={<Select defaultValue="week" style={{ width: 120 }}>
              <Select.Option value="week">This Week</Select.Option>
              <Select.Option value="month">This Month</Select.Option>
              <Select.Option value="year">This Year</Select.Option>
            </Select>}
          >
            <Table 
              columns={invoiceColumns} 
              dataSource={dashboardData.invoices.recent} 
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Bills Summary */}
      <Divider />
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Bills Summary">
            <Row gutter={16}>
              <Col span={8}>
                <Card type="inner" title="Total Bills">
                  <Statistic
                    value={dashboardData.bills.total}
                    prefix={<MoneyCollectOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card type="inner" title="Paid Bills">
                  <Statistic
                    value={dashboardData.bills.paid}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<MoneyCollectOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card type="inner" title="Unpaid Bills">
                  <Statistic
                    value={dashboardData.bills.unpaid}
                    valueStyle={{ color: '#f5222d' }}
                    prefix={<MoneyCollectOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;