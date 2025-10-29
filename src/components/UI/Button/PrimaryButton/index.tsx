import React from "react";
import { Button, type ButtonProps } from "antd";
import classNames from "classnames";
import "./PrimaryButton.css";

type PrimaryButtonProps = ButtonProps & {
  variant?: "solid" | "outlined" | "none";
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  variant = "none", // mặc định none
  ...rest
}) => {
  const buttonClass = classNames("primary-button", {
    "primary-button-solid": variant === "solid",
    "primary-button-outlined": variant === "outlined",
    // variant === "none" vẫn giữ class "primary-button"
  });

  return (
    <Button className={buttonClass} {...rest}>
      {children}
    </Button>
  );
};

export default PrimaryButton;
