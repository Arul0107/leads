// Corrected and optimized Invoice component with fixes applied
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
      businessName: "Sree Amitra Property Developers",
      invoiceNumber: "INV-2024-0008",
      totalAmount: "₹28,875.00",
      createdDate: "Mar 22, 2025",
      financialYear: "2024-2025",
      items: [
        {
          description: "Cement",
          site: "Site A",
          hsn: "2523",
          qty: 10,
          rate: 200,
          amount: 2000,
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
        financialYear: "2024-2025",
        createdDate: moment(),
      });
    }
  }, [isDrawerOpen, editRecord, form]);

  const columns = [
    { title: "S.No", dataIndex: "key", key: "key" },
    { title: "Business Name", dataIndex: "businessName", key: "businessName" },
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      render: (text) => <strong style={{ color: "#1e40af" }}>{text}</strong>,
    },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount" },
    { title: "Created Date", dataIndex: "createdDate", key: "createdDate" },
    { title: "Financial Year", dataIndex: "financialYear", key: "financialYear" },
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

  const calculateAmount = (qty, rate) => (parseFloat(qty) || 0) * (parseFloat(rate) || 0);

  const handleFormSubmit = (values) => {
    const formattedValues = {
      ...values,
      createdDate: values.createdDate.format("MMM D, YYYY"),
    };

    if (editRecord) {
      setIsConfirming(true);
    } else {
      const totalAmount = formattedValues.items.reduce((sum, item) => sum + (item.amount || 0), 0);
      setInvoices([
        ...invoices,
        {
          ...formattedValues,
          key: invoices.length + 1,
          totalAmount: `₹${totalAmount.toFixed(2)}`,
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
    };

    const updatedInvoices = invoices.map((inv) =>
      inv.key === editRecord?.key
        ? {
            ...inv,
            ...formattedValues,
            totalAmount: `₹${formattedValues.items.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2)}`,
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
    doc.text(`Invoice Number: ${record.invoiceNumber}`, 10, 10);
    doc.text(`Business Name: ${record.businessName}`, 10, 20);
    doc.text(`Created Date: ${record.createdDate}`, 10, 30);
    doc.text(`Financial Year: ${record.financialYear}`, 10, 40);
    doc.text(`Total Amount: ${record.totalAmount}`, 10, 50);

    record.items.forEach((item, index) => {
      doc.text(
        `Item ${index + 1}: ${item.description}, Qty: ${item.qty}, Rate: ${item.rate}, Amount: ${item.amount}`,
        10,
        60 + index * 10
      );
    });

    doc.save(`${record.invoiceNumber}.pdf`);
  };

  const generateInvoiceNumber = (financialYear) => {
    const yearPart = financialYear.split("-")[0];
    const lastInvoice = invoices
      .filter((inv) => inv.invoiceNumber.startsWith(`INV-${yearPart}-`))
      .sort()
      .pop();
    const lastNumber = lastInvoice ? parseInt(lastInvoice.invoiceNumber.split("-")[2]) : 0;
    return `INV-${yearPart}-${(lastNumber + 1).toString().padStart(4, "0")}`;
  };

  const handleFinancialYearChange = (year) => {
    if (!editRecord) {
      const newInvoiceNumber = generateInvoiceNumber(year);
      form.setFieldsValue({
        invoiceNumber: newInvoiceNumber,
        createdDate: moment(),
        financialYear: year,
      });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Invoice ({invoices.length})</h2>
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
        placeholder="Search by Business Name or by Invoice ..."
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: 16, maxWidth: 900 }}
      />

      <Table
        dataSource={invoices.filter(
          (inv) =>
            inv.businessName.toLowerCase().includes(searchText.toLowerCase()) ||
            inv.invoiceNumber.toLowerCase().includes(searchText.toLowerCase())
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
          {/* Business Info, Financial Year, Invoice Number, DatePicker */}
          {/* Items List */}
          {/* Submit Button */}

        
          <Form.Item
            name="businessName"
            label="Business Name"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select Business"
              onChange={() => form.validateFields(["businessName"])}
            >
              {Object.keys(businessOptions).map((name) => (
                <Select.Option key={name} value={name}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="financialYear"
            label="Financial Year"
            rules={[{ required: true }]}
          >
            <Select 
              placeholder="Select Financial Year" 
              onChange={handleFinancialYearChange}
              
            >
              <Select.Option value="2024-2025">2024-2025</Select.Option>
              <Select.Option value="2025-2026">2025-2026</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="invoiceNumber"
            label="Invoice Number"
            rules={[{ required: true }]}
          >
            <Input  />
          </Form.Item>

          <Form.Item
            name="createdDate"
            label="Created Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker 
              style={{ width: "100%" }}
              format="MMM D, YYYY"
              
            />
          </Form.Item>

          <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
            <div
              style={{
                width: 150,
                fontWeight: 500,
                color: "#555",
                paddingTop: 8,
              }}
            >
              Business Info
            </div>
            <Card style={{ flex: 1 }}>
              <div>
                {businessOptions[form.getFieldValue("businessName")]?.address.map(
                  (line, idx) => (
                    <p key={idx}>{line}</p>
                  )
                )}
              </div>
            </Card>
          </div>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      rules={[{ required: true, message: "Missing description" }]}
                    >
                      <Input placeholder="Description" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "site"]}
                      rules={[{ required: true, message: "Missing site" }]}
                    >
                      <Input placeholder="Site" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "hsn"]}
                      rules={[{ required: true, message: "Missing HSN/SAC" }]}
                    >
                      <Input placeholder="HSN/SAC" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "qty"]}
                      rules={[{ required: true, message: "Missing qty" }]}
                    >
                      <Input
                        placeholder="Qty"
                        type="number"
                        onChange={(e) => {
                          const qty = e.target.value;
                          const rate = form.getFieldValue(['items', name, 'rate']);
                          const amount = calculateAmount(qty, rate);
                          form.setFieldsValue({
                            items: form.getFieldValue('items').map((item, idx) => 
                              idx === name ? {...item, amount} : item
                            )
                          });
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "rate"]}
                      rules={[{ required: true, message: "Missing rate" }]}
                    >
                      <Input
                        placeholder="Rate"
                        type="number"
                        onChange={(e) => {
                          const rate = e.target.value;
                          const qty = form.getFieldValue(['items', name, 'qty']);
                          const amount = calculateAmount(qty, rate);
                          form.setFieldsValue({
                            items: form.getFieldValue('items').map((item, idx) => 
                              idx === name ? {...item, amount} : item
                            )
                          });
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "amount"]}
                    >
                      <Input placeholder="Amount" disabled />
                    </Form.Item>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({
                      description: '',
                      site: '',
                      hsn: '',
                      qty: 0,
                      rate: 0,
                      amount: 0
                    })}
                    block
                    icon={<PlusOutlined />}
                  >
                    + Add Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

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
