import ImageResize from "@taoqf/quill-image-resize-module";
import Quill from "quill";
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
Quill.register("modules/imageResize", ImageResize);
// Editor is an uncontrolled React component
const Editor = forwardRef(
  ({ readOnly, defaultValue, onTextChange }: any, ref: any) => {
    const containerRef = useRef<any>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
    });

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );
      const quill = new Quill(editorContainer, {
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, false] }],
              [{ font: [] }],
              [{ size: ["small", false, "large", "huge"] }],
              ["bold", "italic", "underline", "link"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ align: [] }],
              [{ color: [] }, { background: [] }],
              ["image"],
            ],
          },
          imageResize: {
            //添加
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white",
            },
            modules: ["Resize", "DisplaySize"],
          },
        },
        theme: "snow",
      });

      ref.current = quill;

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      quill.on(Quill.events.TEXT_CHANGE, (...args: any[]) => {
        onTextChangeRef.current?.(quill.getContents());
      });

      // 获取 Quill 的工具栏模块并自定义图片按钮的行为
      (quill.getModule("toolbar") as any).addHandler("image", () => {
        // 创建一个隐藏的文件输入元素
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        // 当用户选择了文件后
        input.onchange = () => {
          if (input.files === null) return;
          const file = input.files[0];
          if (file) {
            console.log("file", file);
            // 创建 FormData 对象并附加文件
            const formData = new FormData();
            formData.append("file", file);

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
                if (result.url) {
                  // 使用返回的 URL 插入图片
                  const range = quill.getSelection();
                  quill.insertEmbed((range as any).index, "image", result.url);
                }
              })
              .catch((error) => {
                console.error("Error uploading image: ", error);
              });
          }
        };
      });

      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [ref]);

    return <div ref={containerRef}></div>;
  }
);

Editor.displayName = "Editor";

export default Editor;
