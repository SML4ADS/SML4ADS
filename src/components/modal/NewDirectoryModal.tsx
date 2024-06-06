import { Col, Input, Modal, Row, notification } from "antd";
import { ReactElement, useContext, useState } from "react";
import { BaseModalProps } from "./types";
import { refreshTree } from "../../store/action";
import AppContext from "../../store/context";

export default function NewDirectoryModal({
  isModalOpen,
  handleCancel = () => {},
  path,
}: BaseModalProps & {
  path: string;
}): ReactElement {
  const { dispatch } = useContext(AppContext);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!name) {
      notification.error({
        message: "Error",
        description: "Please input directory name",
      });
      return;
    }
    setConfirmLoading(true);
    await window.electronAPI.newDirectory(path, name);
    // refresh tree
    dispatch(refreshTree());
    setName("");
    setConfirmLoading(false);
    handleCancel(e);
  };

  return (
    <Modal
      title="New Directory"
      confirmLoading={confirmLoading}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row className="flex items-center mt-4 mb-4">
        <Col span={6}>Directory name:</Col>
        <Col span={18}>
          <Input
            placeholder="Please input directory name"
            value={name}
            onChange={handleNameChange}
          />
        </Col>
      </Row>
    </Modal>
  );
}