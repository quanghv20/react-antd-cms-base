// components/BackButton.tsx
import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import PrimaryButton from "../PrimaryButton";

// Khai báo hàm onBack mặc định
const onBack = () => {
  window.history.back();
};

interface BackButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, children }) => {
  return (
    <PrimaryButton icon={<ArrowLeftOutlined />} onClick={onClick ?? onBack}>
      {children ?? "Quay lại"}
    </PrimaryButton>
  );
};

export default BackButton;
