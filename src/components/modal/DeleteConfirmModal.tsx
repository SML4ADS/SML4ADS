import { Modal } from "antd";
import { ReactElement, useContext, useState } from "react";
import { BaseModalProps } from "./types";
import AppContext from "../../store/context";
import { refreshTree } from "../../store/action";

export default function DeleteConfirmModal({
  isModalOpen,
  handleCancel = () => {},
  path,
}: BaseModalProps & {
  path: string;
}): ReactElement {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { dispatch } = useContext(AppContext);

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmLoading(true);
    await window.electronAPI.deleteFile(path);
    // refresh tree
    dispatch(refreshTree());
    setConfirmLoading(false);
    handleCancel(e);
  };

  return (
    <Modal
      title="Delete Confirm"
      confirmLoading={confirmLoading}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {`Are you sure to delete ${path}?`}
    </Modal>
  );
}
