import React, { useEffect, useState } from "react";
// import "./index.css";
import TextArea from "antd/es/input/TextArea";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";

export type TMessage = {
  type: "question" | "file" | "answer";
  content: string;
};

interface ChatTextAreaProps {
  history: TMessage[];
}

const ChatHistory: React.FC<Readonly<ChatTextAreaProps>> = ({ history }) => {
  return (
    <div className="chat-text-area mt-2">
      {history.map((item, index) => {
        return (
          <div className="mb-4 relative px-10" key={index}>
            {item.type === "answer" && (
              <Avatar className="absolute left-1 top-0">Ai</Avatar>
            )}
            <div className="border bg-white rounded p-2">
              <div></div>
              {item.type === "file" ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.content,
                  }}
                ></div>
              ) : (
                item.content
              )}
            </div>
            {item.type !== "answer" && (
              <Avatar
                className="absolute right-1 top-0"
                icon={<UserOutlined />}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatHistory;
