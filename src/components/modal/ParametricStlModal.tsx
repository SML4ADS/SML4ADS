import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { BaseModalProps } from "./types";
import AppContext from "../../store/context";
import {
  Button,
  Form,
  FormInstance,
  Input,
  InputRef,
  Modal,
  Popconfirm,
  Row,
  Table,
  notification,
} from "antd";
import { MModel, defaultModel } from "../../model/Model";
import { setSaveFilePath } from "../../store/action";
import { checkModel } from "../content/model/utils/check";
import ParametricStlEditModal from "./ParametricStlEditModal";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  parametricStls: string;
  parameters: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item className="m-0" name={dataIndex}>
        <Input
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          placeholder="Please input"
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap pr-6"
        style={{ minHeight: "20px" }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  parametricStls: string;
  parameters: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

export default function ParametricStlModal({
  isModalOpen,
  handleCancel = () => {},
}: BaseModalProps): ReactElement {
  const { state, dispatch } = useContext(AppContext);
  const { filePath, saveFilePath } = state;
  const activatedFile = filePath.find((file) => file.isActive);

  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const modelRef = useRef(defaultModel());
  const [count, setCount] = useState(0);

  const [parametricStlEditModalVisible, setParametricStlEditModalVisible] =
    useState(false);
  const [parametricStlEditModalText, setParametricStlEditModalText] =
    useState("");
  const [parametricStlEditModalRecord, setParametricStlEditModalRecord] =
    useState<DataType>();

  // onMounted
  useEffect(() => {
    const asyncFn = async () => {
      if (isModalOpen && saveFilePath === "$$\ua265SAVE\ua265$$") {
        dispatch(setSaveFilePath(""));
        try {
          const modelContent = await window.electronAPI.readFile(
            activatedFile!.path
          );
          if (modelContent) {
            const model: MModel = JSON.parse(modelContent);
            checkModel(model);
            const source = [];
            for (let i = 0; i < model.parametricStls.length; i++) {
              source.push({
                key: i,
                parametricStls: model.parametricStls?.[i] ?? "",
                parameters: model.parameters?.[i] ?? "",
              });
            }
            setDataSource(source);
            setCount(source.length);
            modelRef.current = model;
          }
        } catch (error: any) {
          console.error(error);
          notification.error({
            message: "Error",
            description: error.message,
          });
        }
      }
    };
    asyncFn();
  }, [activatedFile, dispatch, isModalOpen, saveFilePath]);

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "parametricStls",
      dataIndex: "parametricStls",
      width: "60%",
      // @ts-ignore
      render: (text, record: DataType) => (
        <div
          style={{ minHeight: "20px" }}
          onClick={() => {
            setParametricStlEditModalVisible(true);
            setParametricStlEditModalText(text);
            setParametricStlEditModalRecord(record);
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "parameters",
      dataIndex: "parameters",
      width: "25%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      // @ts-ignore
      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      parametricStls: "Please input parametricStls",
      parameters: "",
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    setDataSource((dataSource) => {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      return newData;
    });
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmLoading(true);
    modelRef.current.parametricStls = dataSource.map((d) => d.parametricStls);
    modelRef.current.parameters = dataSource.map((d) => d.parameters);
    try {
      // Update requirements of the activated model
      await window.electronAPI.writeJson(activatedFile!.path, modelRef.current);
    } catch (error: any) {
      console.error(error);
      notification.error({
        message: "Error",
        description: error.message,
      });
    }
    setConfirmLoading(false);
    handleCancel(e);
  };

  return (
    <>
      <Modal
        title="PSTL"
        confirmLoading={confirmLoading}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <div>
          <Button onClick={handleAdd} type="primary" className="mb-4">
            Add a parametricStls
          </Button>
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={dataSource}
            size="middle"
            columns={columns as ColumnTypes}
            pagination={false}
            scroll={{ y: 300 }}
          />
          <Row className="flex items-center mt-4 mb-4"></Row>
        </div>
      </Modal>
      <ParametricStlEditModal
        isModalOpen={parametricStlEditModalVisible}
        handleCancel={() => setParametricStlEditModalVisible(false)}
        text={parametricStlEditModalText}
        handleSave={handleSave}
        record={parametricStlEditModalRecord}
      />
    </>
  );
}