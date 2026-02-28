import React, { useEffect, useRef, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-40 w-full bg-slate-800 animate-pulse" />, // Optional: a skeleton loader
});

const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) => {
  const [editorValue, setEditorValue] = useState(value || "");
  const quillRef = useRef(false);

  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = true;

      setTimeout(() => {
        document.querySelectorAll(".ql-toolbar").forEach((toolbar, index) => {
          if (index > 0) toolbar.remove();
        });
      }, 100);
    }
  }, []);

  return (
    <div className="relative">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={(content) => {
          setEditorValue(content);
          onChange(content);
        }}
        modules={{
          toolbar: [
            [{ font: [] }], // Font picker
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headers
            [{ size: ["small", "large", "huge", false] }], // Font size
            ["bold", "italic", "underline", "strike"], // Basic text styling
            [{ color: [] }, { background: [] }], // Font and Background color
            [{ script: "sub" }, { script: "super" }], // Subscript / Superscript
            [{ list: "ordered" }, { list: "bullet" }], // Lists
            [{ indent: "-1" }, { indent: "+1" }], // Indentation
            [{ align: [] }], // Text alignment
            ["blockquote", "code-block"], // Blockquote and Code block
            ["link", "image", "video"], // Insert Link, Image and Video
            ["clean"], // Remove formatting
          ],
        }}
        placeholder="Write a detailed product description here ..."
        className="bg-transparent border border-gray-700 text-white rounded-md"
        style={{
          minHeight: "250px",
        }}
      />

      <style>
        {`
            .ql-toolbar {
                background: transparent;
                border-color: #444;
            }
            .ql-container {
                background: transparent !important;
                border-color: #444;
                color: white;
            }
            .ql-picker {
                color: white !important;
            }
            .ql-editor {
                min-height: 200px;
            }
            .ql-snow {
                border-color: #444 !important;
            }
            .ql-editor .ql-blank::before {
                color: #aaa !important;
            }
            .ql-picker-options {
                background: #333 !important;
                color: white !important;
            }
            .ql-picker-item {
                color: white !important;
            }
            .ql-stroke {
                stroke: white !important;
            }
        `}
      </style>
    </div>
  );
};

export default RichTextEditor;
