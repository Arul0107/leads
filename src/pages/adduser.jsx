import React, { useState } from 'react';
import { Table, Input, Button, Tag, Space, Popconfirm, Modal, Form, Select, message, Switch } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  CloseOutlined,
  CheckCircleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined 
} from '@ant-design/icons';

const { Option } = Select;

const AddUser = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [data, setData] = useState([
    {
      key: '1',
      sno: 1,
      name: 'Info Superuser',
      email: 'info@acculermedia.in',
      mobile: '(735) 811-2791',
      status: 'active',
      role: 'superuser',
      password: 'password123' // Added password field
    },
    {
      key: '2',
      sno: 2,
      name: 'Ramesh Superuser',
      email: 'imagetex77@gmail.com',
      mobile: '(989) 452-6079',
      status: 'active',
      role: 'superuser',
      password: 'password456' // Added password field
    },
  ]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleStatusChange = (key, checked) => {
    const newStatus = checked ? 'active' : 'inactive';
    setData(data.map(item => 
      item.key === key ? { ...item, status: newStatus } : item
    ));
    message.success(`User status changed to ${newStatus}`);
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: 80,
      render: (text) => `${text}.`,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span>
          {text.replace('Superuser', '')}
          <Tag color={record.role === 'superuser' ? 'blue' : 'purple'} style={{ marginLeft: 8 }}>
            {record.role === 'superuser' ? 'Superuser' : 'User'}
          </Tag>
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={status === 'active'}
          onChange={(checked) => handleStatusChange(record.key, checked)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              danger 
              icon={<CloseOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      ...record,
      // Don't pre-fill password for security reasons
      password: ''
    });
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setData(data.filter(item => item.key !== key));
    message.success('User deleted successfully');
  };

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    if (editingUser) {
      // Update existing user - only update password if it was changed
      const updatedUser = {
        ...editingUser,
        ...values,
        password: values.password || editingUser.password
      };
      
      setData(data.map(item => 
        item.key === editingUser.key ? updatedUser : item
      ));
      message.success('User updated successfully');
    } else {
      // Add new user
      const newUser = {
        key: (data.length + 1).toString(),
        sno: data.length + 1,
        ...values,
        status: 'active'
      };
      setData([...data, newUser]);
      message.success('User added successfully');
    }
    setIsModalVisible(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '16px',
        alignItems: 'center'
      }}>
        <h1 style={{fontFamily:"sans-serif"}}>User List <span style={{color:"#4096ff"}}>{data.length}</span> records</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleCreate}
        >
          Create User
        </Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <Input
          placeholder="Search by Name or Email"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredData} 
        bordered
        pagination={{ pageSize: 5, showSizeChanger: true }}
        style={{ 
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
        rowKey="key"
      />

      <Modal
        title={editingUser ? 'Edit User' : 'Create User'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'active'
          }}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            name="mobile"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please input the mobile number!' },
              { pattern: /^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/, message: 'Please enter a valid phone number!' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="(123) 456-7890" />
          </Form.Item>

          <Form.Item
            name="role"
            label="User Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select placeholder="Select user role">
              <Option value="superuser">Superuser</Option>
              <Option value="user">Regular User</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Account Status"
            rules={[{ required: true }]}
            hidden={!editingUser} // Only show status in edit mode
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            label={editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
            rules={[
              editingUser ? {} : { required: true, message: 'Please input the password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder={editingUser ? 'Enter new password' : 'Enter password'} 
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddUser;