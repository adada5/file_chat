import React, { useEffect, useMemo, useState } from "react";
// import "./index.css";
import TextArea from "antd/es/input/TextArea";
import { SendOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface ChatTextAreaProps {
  placeholder?: string;
  value?: string;
  onChange?: (vaule: string) => void;
  onSend?: () => void;
}

const ChatTextArea: React.FC<Readonly<ChatTextAreaProps>> = ({
  value,
  placeholder = "请输入合同背景信息...",
  onChange,
  onSend,
}) => {
  const textNum = useMemo(() => (value ? value.length : 0), [value]);
  return (
    <div className="chat-text-area border bg-white rounded-xl">
      <TextArea
        className="border-none !shadow-none rounded-xl"
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        placeholder={placeholder}
        autoSize={{ minRows: 5, maxRows: 5 }}
      />
      <div className="mb-4 flex justify-between items-center px-3">
        <div>{textNum}/200</div>
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={() => {
            onSend?.();
          }}
        ></Button>
      </div>
    </div>
  );
};

export default ChatTextArea;
