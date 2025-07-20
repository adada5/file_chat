import "./index.css";
import "quill/dist/quill.snow.css";

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import Editor from "./Editor";

export interface IEditorContainerProps {
  value: { ops: any[] };
  hidePreview?: boolean;
  onValueChange: (arg0: any) => void;
}

const EditorContainer = forwardRef(
  (
    { value, hidePreview = false, onValueChange }: IEditorContainerProps,
    ref: any
  ) => {
    const [readOnly, setReadOnly] = useState(false);

    // Use a ref to access the quill instance directly
    const quillRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      setContent: (value: any) => {
        console.log(value);
        quillRef.current.setContents(value);
      },
    }));

    return (
      <div>
        <Editor
          ref={quillRef}
          readOnly={readOnly}
          defaultValue={value}
          onTextChange={onValueChange}
        />
        <div className="controls ">
          <label className="flex items-center">
            Read Only:{" "}
            <input
              type="checkbox"
              value={readOnly as any}
              onChange={(e) => setReadOnly(e.target.checked)}
            />
          </label>
          <button
            className="controls-right"
            type="button"
            onClick={() => {
              // alert(quillRef.current?.getLength());
              alert(quillRef.current?.root?.innerHTML);
            }}
          >
            Get Content Length
          </button>
        </div>
        {hidePreview && (
          <>
            <div className="state">
              <div className="state-title">text:</div>
              {value ? JSON.stringify(value) : "Empty"}
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: quillRef.current?.root?.innerHTML,
              }}
            ></div>
          </>
        )}
      </div>
    );
  }
);

export default EditorContainer;
