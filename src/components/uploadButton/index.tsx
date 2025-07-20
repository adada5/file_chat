import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Button, Upload } from "antd";
import "./index.css";

export type TFileReturn = {
  originalFilename: string;
  status: string;
  url: string;
};

interface UploadButtonProps {
  onChange?: (fileList: UploadFile[]) => void;
  onUploadSuccess?: (url: TFileReturn) => void;
  placeholder?: string;
}

const UploadButton: React.FC<Readonly<UploadButtonProps>> = ({
  onChange,
  onUploadSuccess,
  placeholder = "新建参考文档",
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);
    onChange?.([...fileList]);
  };

  const uploadProps: UploadProps = {
    name: "file",
    action: "http://localhost:2020/upload",
    onChange: handleChange,
    customRequest: () => {
      console.log("customRequest"); // 创建 FormData 对象并附加文件
      const formData = new FormData();
      formData.append("file", (fileList as any[]).at(-1).originFileObj);
      console.log((fileList as any[]).at(-1));
      // 上传图片到服务器
      fetch("http://localhost:2020/upload", {
        method: "POST",
        body: formData,
        headers: {
          authorization: "authorization-text",
        },
      })
        .then((response) => response.json())
        .then((result) => {
          onUploadSuccess?.(result);
        })
        .catch((error) => {
          console.error("Error uploading image: ", error);
        });
    },
  };

  return (
    <Upload {...uploadProps} className="file-chat-upload-button">
      <Button type="primary">{placeholder}</Button>
    </Upload>
  );
};

export default UploadButton;
