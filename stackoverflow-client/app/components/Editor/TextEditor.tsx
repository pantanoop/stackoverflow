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
import { useEffect, useRef } from "react";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TextEditor({ value, onChange }: TextEditorProps) {
  const rteRef = useRef<RichTextEditorRef>(null);

  useEffect(() => {
    const editor = rteRef.current?.editor;
    if (!editor) return;

    if (value === "" && editor.getHTML() !== "<p></p>") {
      editor.commands.setContent("");
    }
  }, [value]);

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
        border: "1px solid #ccc",
        "& .MuiTiptap-RichTextField-content": {
          padding: "16px",
          margin: "20px",
          minHeight: "10vh",
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
