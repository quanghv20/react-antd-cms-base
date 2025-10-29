import React from "react";
import { message } from "antd";
import type { MessageInstance } from "antd/es/message/interface";

let messageApi: MessageInstance;

export const MessageHolder: React.FC = () => {
  const [api, contextHolder] = message.useMessage();
  messageApi = api; // gán instance thực tế

  return <>{contextHolder}</>;
};

// Xuất global message API
export const appMessage = {
  success: (content: string) => messageApi?.success(content),
  error: (content: string) => messageApi?.error(content),
  warning: (content: string) => messageApi?.warning(content),
  info: (content: string) => messageApi?.info(content),
};
