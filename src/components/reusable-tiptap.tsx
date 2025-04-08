import { cn } from "@/lib/utils";
import React, { memo } from "react";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap/minimal-tiptap";

interface ReusableTiptapEditorProps {
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  name?: string;
  className?: string;
  editorClassName?: string;
  editorContentClassName?: string;
  placeholder?: string;
  throttleDelay?: number;
  output?: "html" | "json";
  editable?: boolean;
  immediatelyRender?: boolean;
  injectCSS?: boolean;
  shouldRerenderOnTransaction?: boolean;
  hasError?: boolean;
}

const ReusableTiptapEditor: React.FC<ReusableTiptapEditorProps> = ({
  value,
  onChange,
  onBlur,
  name,
  className,
  editorClassName = "",
  editorContentClassName = "p-5 overflow-y-auto",
  placeholder = "Start typing...",
  throttleDelay = 0,
  output = "json",
  editable = true,
  immediatelyRender = false,
  injectCSS = true,
  shouldRerenderOnTransaction = false,
  hasError = false
}) => {
  return (
    <div className={cn("w-full", className)}>
      <MinimalTiptapEditor
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        throttleDelay={throttleDelay}
        className={cn("h-full min-h-56 w-full rounded-xl", {
          "border-destructive focus-within:border-destructive": hasError
        })}
        editorContentClassName={editorContentClassName}
        output={output}
        placeholder={placeholder}
        editable={editable}
        editorClassName={editorClassName}
        injectCSS={injectCSS}
        shouldRerenderOnTransaction={false}
      />
    </div>
  );
};

export default memo(ReusableTiptapEditor);
