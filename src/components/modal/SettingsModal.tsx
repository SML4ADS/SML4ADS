import { Col, InputNumber, Modal, Row } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import { BaseModalProps } from "./types";
import { setConfig } from "../../store/action";
import AppContext from "../../store/context";

export default function SettingsModal({
  isModalOpen,
  handleCancel: _handleCancel = () => {},
}: BaseModalProps): ReactElement {
  const { state, dispatch } = useContext(AppContext);
  const { config } = state;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [localPort, setLocalPort] = useState(config.simulationPort);

  useEffect(() => {
    setLocalPort(config.simulationPort);
  }, [config.simulationPort]);

  const handlePortChange = (value: number | null) => {
    if (value) setLocalPort(value);
  };

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmLoading(true);
    dispatch(setConfig({ ...config, simulationPort: localPort }));
    await window.electronAPI.writeConfig({
      ...config,
      simulationPort: localPort,
    });
    setConfirmLoading(false);
    _handleCancel(e);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    // recover to original value
    setLocalPort(config.simulationPort);
    _handleCancel(e);
  };

  return (
    <Modal
      title="Settings"
      confirmLoading={confirmLoading}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row className="flex items-center mt-4 mb-4">
        <Col span={6}>Port:</Col>
        <Col span={18}>
          <InputNumber
            min={0}
            max={65535}
            value={localPort}
            onChange={handlePortChange}
          />
        </Col>
      </Row>
    </Modal>
  );
}