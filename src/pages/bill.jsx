import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Card,
  Form,
  Space,
  Drawer,
  message,
  Select,
  Modal,
  DatePicker,
  Radio,
  Row,
  Col
} from "antd";
import {
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { jsPDF } from "jspdf";
import moment from "moment";

const businessOptions = {
  "AADHIRA TRADERS": {
    name: "AADHIRA TRADERS",
    address: [
      "Old no -10/25, NEW NO- 32",
      "Maruthamalai Murugan Nagar",
      "Kalveerampalayam",
      "Coimbatore 641046",
      "Tamil Nadu, India",
      "33CTWPP2919L1ZX",
    ],
  },
  "Sree Amitra Property Developers": {
    name: "Sree Amitra Property Developers",
    address: [
      "Plot No 12, Vaibhav Nagar",
      "Peelamedu",
      "Coimbatore 641004",
      "Tamil Nadu, India",
      "GSTIN: 33AMTPS1234K1Z1",
    ],
  },
};

const Invoice = () => {
  const [searchText, setSearchText] = useState("");
  const [invoices, setInvoices] = useState([
    {
      key: 1,
      customerName: "John Doe",
      mobileNumber: "9876543210",
      siteName: "Site A",
      gstNo: "33ABCDE1234F1Z1",
      totalAmount: "₹28,875.00",
      createdDate: "Mar 22, 2025",
      items: [
        {
          description: "Cement",
          quantity: 10,
          length: 5,
          breath: 5,
          area: 25,
          rate: 200,
          amount: 50000,
        },
      ],
    },
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form] = Form.useForm();
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (isDrawerOpen && !editRecord) {
      form.setFieldsValue({
        createdDate: moment(),
      });
    }
  }, [isDrawerOpen, editRecord, form]);

  const columns = [
    { title: "S.No", dataIndex: "key", key: "key" },
    { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
    { title: "Mobile Number", dataIndex: "mobileNumber", key: "mobileNumber" },
    { title: "Site Name", dataIndex: "siteName", key: "siteName" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount" },
    { title: "Created Date", dataIndex: "createdDate", key: "createdDate" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<DownloadOutlined />} onClick={() => handleDownloadPDF(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
        </Space>
      ),
    },
  ];

  const calculateAmount = (name) => {
    const items = form.getFieldValue('items');
    const currentItem = items[name];
    
    if (currentItem) {
      const length = parseFloat(currentItem.length) || 0;
      const breath = parseFloat(currentItem.breath) || 0;
      const quantity = parseFloat(currentItem.quantity) || 0;
      const rate = parseFloat(currentItem.rate) || 0;
      
      const area = length * breath;
      const amount = area * quantity * rate;
      
      form.setFieldsValue({
        items: items.map((item, idx) => 
          idx === name 
            ? { ...item, area: area.toFixed(2), amount: amount.toFixed(2) } 
            : item
        )
      });

      // Update total amount
      const updatedItems = form.getFieldValue('items');
      const totalAmount = updatedItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      form.setFieldValue('totalAmount', totalAmount.toFixed(2));
    }
  };

  const handleSearch = (e) => setSearchText(e.target.value);

  const handleEdit = (record) => {
    setEditRecord(record);
    form.setFieldsValue({
      ...record,
      createdDate: moment(record.createdDate, moment.ISO_8601, true).isValid()
        ? moment(record.createdDate)
        : moment(record.createdDate, "MMM D, YYYY"),
    });
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setEditRecord(null);
    form.resetFields();
  };

  const handleFormSubmit = (values) => {
    const formattedValues = {
      ...values,
      createdDate: values.createdDate.format("MMM D, YYYY"),
      totalAmount: `₹${values.totalAmount}`
    };

    if (editRecord) {
      setIsConfirming(true);
    } else {
      setInvoices([
        ...invoices,
        {
          ...formattedValues,
          key: invoices.length + 1,
        },
      ]);
      message.success("Invoice created successfully");
      handleDrawerClose();
    }
  };

  const handleConfirmEdit = () => {
    const values = form.getFieldsValue();
    const formattedValues = {
      ...values,
      createdDate: values.createdDate.format("MMM D, YYYY"),
      totalAmount: `₹${values.totalAmount}`
    };

    const updatedInvoices = invoices.map((inv) =>
      inv.key === editRecord?.key
        ? {
            ...inv,
            ...formattedValues,
          }
        : inv
    );
    setInvoices(updatedInvoices);
    message.success("Invoice updated successfully");
    handleDrawerClose();
    setIsConfirming(false);
  };

  const handleCancelEdit = () => setIsConfirming(false);

  const handleDownloadPDF = (record) => {
    const doc = new jsPDF();
    doc.text(`Invoice Number: ${record.invoiceNumber || 'N/A'}`, 10, 10);
    doc.text(`Customer Name: ${record.customerName}`, 10, 20);
    doc.text(`Mobile Number: ${record.mobileNumber}`, 10, 30);
    doc.text(`Site Name: ${record.siteName}`, 10, 40);
    doc.text(`Created Date: ${record.createdDate}`, 10, 50);
    doc.text(`Total Amount: ${record.totalAmount}`, 10, 60);

    doc.text('Items:', 10, 70);
    record.items.forEach((item, index) => {
      const yPos = 80 + index * 10;
      doc.text(
        `${index + 1}. ${item.description} - Qty: ${item.quantity}, Area: ${item.area} sq.ft, Rate: ₹${item.rate}, Amount: ₹${item.amount}`,
        10,
        yPos
      );
    });

    doc.save(`${record.customerName}_Invoice.pdf`);
  };

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Invoices ({invoices.length})</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setEditRecord(null);
            setIsDrawerOpen(true);
          }}
        >
          Create Invoice
        </Button>
      </Space>

      <Input.Search
        placeholder="Search by Customer Name or Mobile Number..."
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: 16, maxWidth: 900 }}
      />

      <Table
        dataSource={invoices.filter(
          (inv) =>
            inv.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
            inv.mobileNumber.includes(searchText)
        )}
        columns={columns}
        pagination={false}
      />

      <Drawer
        title={editRecord ? "Edit Invoice" : "Create Invoice"}
        width="80%"
        onClose={handleDrawerClose}
        open={isDrawerOpen}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Customer Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Customer Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mobileNumber"
                label="Mobile Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="Mobile Number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="siteName"
                label="Site Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Site Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gstNo"
                label="GST No"
              >
                <Input placeholder="GST No" />
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={5}><strong>Description</strong></Col>
                    <Col span={3}><strong>Quantity</strong></Col>
                    <Col span={3}><strong>Length (Sq.ft)</strong></Col>
                    <Col span={3}><strong>Breath (Sq.ft)</strong></Col>
                    <Col span={3}><strong>Area (Sq.ft)</strong></Col>
                    <Col span={3}><strong>Rate</strong></Col>
                    <Col span={3}><strong>Amount</strong></Col>
                    <Col span={1}></Col>
                  </Row>
                </div>

                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={16} style={{ marginBottom: 8 }} align="middle">
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Description" />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, "quantity"]}
                        rules={[{ required: true }]}
                      >
                        <Input 
                          type="number" 
                          placeholder="Qty" 
                          onChange={(e) => calculateAmount(name)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, "length"]}
                        rules={[{ required: true }]}
                      >
                        <Input 
                          type="number" 
                          placeholder="Length" 
                          onChange={(e) => calculateAmount(name)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, "breath"]}
                        rules={[{ required: true }]}
                      >
                        <Input 
                          type="number" 
                          placeholder="Breath" 
                          onChange={(e) => calculateAmount(name)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, "area"]}
                      >
                        <Input placeholder="Area" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, "rate"]}
                        rules={[{ required: true }]}
                      >
                        <Input 
                          type="number" 
                          placeholder="Rate" 
                          onChange={(e) => calculateAmount(name)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        {...restField}
                        name={[name, "amount"]}
                      >
                        <Input placeholder="Amount" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({
                      description: '',
                      quantity: 0,
                      length: 0,
                      breath: 0,
                      area: 0,
                      rate: 0,
                      amount: 0
                    })}
                    block
                    icon={<PlusOutlined />}
                  >
                    + Add Option
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="totalAmount"
                label="Total Amount"
              >
                <Input placeholder="Total Amount" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isTaxApplicable"
                label="Is Tax Applicable?"
                valuePropName="checked"
              >
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="keyNotes" label="Key Notes">
            <Input.TextArea rows={3} placeholder="keynotes" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editRecord ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title="Confirm Edit"
        open={isConfirming}
        onOk={handleConfirmEdit}
        onCancel={handleCancelEdit}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Are you sure you want to update this invoice?</p>
      </Modal>
    </div>
  );
};

export default Invoice;