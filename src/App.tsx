import { useRef, useState } from "react";
import "./App.css";
import Editor from "./components/editor";
import UploadButton, { TFileReturn } from "./components/uploadButton";
import { urlToFile, fileToHtml, htmlToDelta } from "./utils";
import { Avatar, Button, Dropdown } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import ChatTextArea from "./components/chatTextArea";
import ChatHistory, { TMessage } from "./components/chatHistory";

function App() {
  const [editorValue, setEditorValue] = useState<any>({
    ops: [],
  });
  const [fileList, setFleList] = useState<TFileReturn[]>([]);
  const editorRef = useRef<any>(null);
  const [history, setHistory] = useState<TMessage[]>([]);
  const [textAreaValue, setTextAreaValue] = useState("");

  const setEditorContent = async (file: TFileReturn) => {
    const newFile = await urlToFile(file.url, file.originalFilename);
    const html = await fileToHtml(newFile);
    setHistory((list) => [...list, { type: "file", content: html }]);
    editorRef.current.setContent(htmlToDelta(html));
  };
  const onUploadSuccess = (file: TFileReturn) => {
    setFleList((val) => [...val, file]);
    setEditorContent(file);
  };
  const onSend = async () => {
    setHistory((list) => [
      ...list,
      { type: "question", content: textAreaValue },
    ]);
    const param = { question: textAreaValue, fileHtml: "" };
    if (history.at(-1)?.type === "file") {
      param.fileHtml = history.at(-1)?.content || "";
    }
    setTextAreaValue("");
    const { content } = await fetch("http://localhost:2020/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(param),
    }).then((response) => response.json());
    setHistory((list) => [...list, { type: "answer", content }]);
    editorRef.current.setContent(htmlToDelta(`<p1>${content}</p>`));
  };

  return (
    <div className="flex h-screen">
      {/* 侧边栏上传文件 */}
      <div className="w-72">
        <div className="flex h-full flex-col">
          <div className="pt-8 pl-12 pb-4 text-2xl font-bold bg-gradient-to-b from-blue-200 to-transparent border-b border-gray-200">
            AI 助手
          </div>
          <div className="flex-1 p-4">
            {fileList.map((item, index) => {
              return (
                <div
                  className="rounded-xl border border-gray-200 p-2"
                  key={index}
                >
                  {"</>"}
                  {item.originalFilename}
                </div>
              );
            })}
          </div>
          <div className="flex mb-12 justify-center">
            <UploadButton onUploadSuccess={onUploadSuccess}></UploadButton>
          </div>
        </div>
      </div>

      {/* 富文本 */}
      <div className="flex-1 border border-gray-200">
        <Editor
          ref={editorRef}
          value={editorValue}
          onValueChange={setEditorValue}
        />
      </div>

      {/* 聊天框 */}
      <div className="w-96 bg-[#f9f9fb]">
        <div className="flex h-full flex-col">
          <div className="flex items-center pt-8 pl-10 pb-4 border-b border-gray-200">
            <Avatar icon={<UserOutlined />} />
            <div className="ml-2">
              <div className="text-lg font-bold">MOMO</div>
              <div className="text-xs">mmomo@MODAO.com</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-scroll">
            <ChatHistory history={history} />
          </div>
          <div className="mt-2 p-1 ">
            <div className="mb-1">
              <Dropdown
                menu={{
                  items: [
                    {
                      label: "qwen-plus",
                      key: "1",
                    },
                  ],
                }}
              >
                <Button>
                  qwen-plus
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            <ChatTextArea
              value={textAreaValue}
              onChange={(value) => setTextAreaValue(value)}
              onSend={onSend}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
