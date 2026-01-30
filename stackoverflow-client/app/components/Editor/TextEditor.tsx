"use client";

import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  type RichTextEditorRef,
} from "mui-tiptap";
import { useRef } from "react";
// import "./muitiptap.css";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TextEditor({ value, onChange }: TextEditorProps) {
  const rteRef = useRef<RichTextEditorRef>(null);

  return (
    <RichTextEditor
      ref={rteRef}
      extensions={[StarterKit]}
      content={value || ""}
      immediatelyRender={false}
      onUpdate={() => {
        const html = rteRef.current?.editor?.getHTML() || "";
        onChange(html);
      }}
      sx={{
        backgroundColor: "fwhite",

        border: "1px solid #ccc",
        "& .MuiTiptap-RichTextField-content": {
          padding: "16px",
          margin: "20px",
          hieght: "10vh",
          fontFamily: "Roboto, sans-serif",
        },
      }}
      renderControls={() => (
        <MenuControlsContainer>
          <MenuSelectHeading />
          <MenuDivider />
          <MenuButtonBold />
          <MenuButtonItalic />
        </MenuControlsContainer>
      )}
    />
  );
}
