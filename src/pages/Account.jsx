import React, { useState } from 'react';
import {
  Table,
  Input,
  Button,
  Tag,
  Space,
  Popconfirm,
  Modal,
  Form,
  Select,
  message,
  Row,
  Col,
  Tabs,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  CloseOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  IdcardOutlined,
  HomeOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const Account = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [data, setData] = useState([
    {
      key: '1',
      businessName: '7 Crafts Contracting P Ltd',
      contactName: 'Vinoth',
      email: 'vinoth@7crafts.com',
      mobile: '9944477433',
      phone: '0422 264925',
      address1: 'SF 194/1 K VPM Village',
      address2: 'P & T Colony Distn',
      address3: '',
      landmark: '',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      country: 'India',
      pincode: '641025',
      website: 'https://www.7crafts.com',
      gstNumber: '33AABCZ3641G1ZI',
      status: 'active',
    },
  ]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredData = data.filter(
    (item) =>
      item.businessName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.contactName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleEdit = (record) => {
    setEditingBusiness(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.success('Business deleted successfully');
  };

  const handleCreate = () => {
    setEditingBusiness(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values) => {
    if (editingBusiness) {
      setData(
        data.map((item) =>
          item.key === editingBusiness.key ? { ...item, ...values } : item
        )
      );
      message.success('Business updated successfully');
    } else {
      const newBusiness = {
        key: (data.length + 1).toString(),
        ...values,
        status: 'active',
      };
      setData([...data, newBusiness]);
      message.success('Business added successfully');
    }
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Business Name',
      dataIndex: 'businessName',
      key: 'businessName',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.contactName}</div>
        </div>
      ),
      width: 200,
      fixed: 'left',
    },
    {
      title: 'Email ID',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <div>
          <MailOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div>
            <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            {record.mobile}
          </div>
          {record.phone && (
            <div>
              <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              {record.phone}
            </div>
          )}
        </div>
      ),
      width: 150,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => (
        <div>
          <div>{record.address1}</div>
          {record.address2 && <div>{record.address2}</div>}
          <div>
            {record.city}, {record.state} - {record.pincode}
          </div>
          <div>{record.country}</div>
        </div>
      ),
      width: 250,
    },
    {
      title: 'GST',
      dataIndex: 'gstNumber',
      key: 'gstNumber',
      render: (gst) => (
        <h5>          {gst}
</h5>
     
      ),
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
      width: 100,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: '#1890ff' }} />}
            onClick={() => handleEdit(record)}
            title="Edit"
          />
          <Popconfirm
            title="Are you sure to delete this business?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button type="text" danger icon={<CloseOutlined />} title="Delete" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>Business Management ({data.length} records)</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Add Business
        </Button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <Input
          placeholder="Search by Business Name, Contact or Email"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 400 }}
          allowClear
        />
      </div>

      {/* TABS - Active and Inactive Businesses */}
      <Tabs defaultActiveKey="active">
        <TabPane tab="Active Businesses" key="active">
          <Table
            columns={columns}
            dataSource={filteredData.filter((item) => item.status === 'active')}
            bordered
            pagination={{ pageSize: 5, showSizeChanger: true }}
            rowKey="key"
          />
        </TabPane>
        <TabPane tab="Inactive Businesses" key="inactive">
          <Table
            columns={columns}
            dataSource={filteredData.filter((item) => item.status === 'inactive')}
            bordered
            pagination={{ pageSize: 5, showSizeChanger: true }}
            rowKey="key"
          />
        </TabPane>
      </Tabs>

      {/* Modal Form */}
      <Modal
        title={editingBusiness ? 'Edit Business' : 'Add New Business'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="businessName"
                label="Business Name"
                rules={[{ required: true, message: 'Please input business name!' }]}
              >
                <Input prefix={<HomeOutlined />} placeholder="Business Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactName"
                label="Contact Person"
                rules={[{ required: true, message: 'Please input contact name!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Contact Name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input email!' },
                  { type: 'email', message: 'Please enter valid email!' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mobile"
                label="Mobile Number"
                rules={[{ required: true, message: 'Please input mobile number!' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Mobile" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="phone" label="Phone Number">
                <Input prefix={<PhoneOutlined />} placeholder="Phone" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="website"
                label="Website"
                rules={[{ type: 'url', message: 'Please enter valid URL!' }]}
              >
                <Input prefix={<GlobalOutlined />} placeholder="https://" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address1"
            label="Address Line 1"
            rules={[{ required: true, message: 'Please input address!' }]}
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="Address Line 1" />
          </Form.Item>

          <Form.Item name="address2" label="Address Line 2">
            <Input prefix={<EnvironmentOutlined />} placeholder="Address Line 2" />
          </Form.Item>

          <Form.Item name="address3" label="Address Line 3">
            <Input prefix={<EnvironmentOutlined />} placeholder="Address Line 3" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="landmark" label="Landmark">
                <Input placeholder="Landmark" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please input city!' }]}
              >
                <Input placeholder="City" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="pincode"
                label="Pincode"
                rules={[{ required: true, message: 'Please input pincode!' }]}
              >
                <Input placeholder="Pincode" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please input state!' }]}
              >
                <Input placeholder="State" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="country"
                label="Country"
                rules={[{ required: true, message: 'Please input country!' }]}
              >
                <Input placeholder="Country" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="gstNumber"
            label="GST Number"
            rules={[{ required: true, message: 'Please input GST number!' }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="GST Number" />
          </Form.Item>

          {editingBusiness && (
            <Form.Item
              name="status"
              label="Account Status"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingBusiness ? 'Update Business' : 'Add Business'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Account;
