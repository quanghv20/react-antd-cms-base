import { useEffect, useState } from "react";
import {
  Table,
  Form,
  Input,
  Popconfirm,
  Row,
  Col,
  Card,
  Tag,
  Button,
  Select,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import type {
  IUser,
  IUserPayload,
  IUserSearchParams,
} from "@/services/user/user.type";
import { userService } from "@/services";
import UserFormModal from "./modals/UserFormModal";
import UserViewModal from "./modals/UserViewModal";

const { Option } = Select;

export default function UserManagementPage() {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  const [data, setData] = useState<IUser[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<IUser | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingItem, setViewingItem] = useState<IUser | null>(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 🔹 Fetch data */
  const fetchUsers = async (params?: IUserSearchParams) => {
    try {
      const res = await userService.search(params || {});
      setData(res.data);
      setPagination({
        current: params?.page || 1,
        pageSize: params?.size || 10,
        total: res.count,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /** 🔹 Actions */
  const handleView = async (item: IUser) => {
    try {
      const res = await userService.getById(item.id);
      setViewingItem(res);
      setViewModalVisible(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (item: IUser) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await userService.remove([id]);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = form.getFieldsValue() as IUserPayload;
      if (editingItem) {
        await userService.update(editingItem.id, values);
      } else {
        await userService.create(values);
      }
      setModalVisible(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    const values = filterForm.getFieldsValue();
    const params: IUserSearchParams = {
      fullName: values.fullName,
      employeeCode: values.employeeCode,
      status:
        values.status === 1
          ? "ACTIVE"
          : values.status === 0
          ? "INACTIVE"
          : undefined,
      page: 1,
      size: 10,
    };
    fetchUsers(params);
  };

  /** 🔹 Table columns */
  const columns: ColumnsType<IUser> = [
    {
      title: "Mã NV",
      dataIndex: "employeeCode",
      key: "employeeCode",
      width: 120,
      align: "center",
    },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (val: string) => (
        <Tag color={val === "ACTIVE" ? "green" : "red"}>
          {val === "ACTIVE" ? "Đang hoạt động" : "Ngưng hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {/* Xem chi tiết */}
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => handleView(record)}
          />

          {/* Sửa thông tin */}
          <EditOutlined
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          />

          {/* Xoá người dùng */}
          <Popconfirm
            title="Bạn có chắc muốn xoá người dùng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Form tìm kiếm */}
      <Card style={{ margin: "24px 0px" }} title="Tìm kiếm người dùng">
        <Form form={filterForm} layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Mã nhân viên" name="employeeCode">
                <Input placeholder="Nhập mã NV" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Họ tên" name="fullName">
                <Input placeholder="Nhập họ tên" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Email" name="email">
                <Input placeholder="Nhập email" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Trạng thái" name="status">
                <Select allowClear placeholder="Chọn trạng thái">
                  <Option value={1}>Hoạt động</Option>
                  <Option value={0}>Ngưng hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div className="flex-center">
            <Button type="primary" ghost onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </div>
        </Form>
      </Card>

      {/* Button tạo mới */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button type="primary" onClick={handleAdd}>
          Thêm mới
        </Button>
      </div>

      {/* Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={pagination}
      />

      <UserFormModal
        visible={modalVisible}
        item={editingItem}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />

      <UserViewModal
        visible={viewModalVisible}
        item={viewingItem}
        onCancel={() => setViewModalVisible(false)}
      />
    </div>
  );
}
