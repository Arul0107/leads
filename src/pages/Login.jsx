import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    // Simple authentication without validation
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      message.success('Login successful!');
      navigate('/dashboard');
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <Card title="Login" style={{ width: 400 }}>
        <Form
          name="login-form"
          onFinish={onFinish}
        >
          <Form.Item name="username">
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item name="password">
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%' }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;