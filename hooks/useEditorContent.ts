import { useState } from "react";

const useEditorContent = () => {
  const [editorContent, setEditorContent] = useState("");

  return { editorContent, setEditorContent };
};

export default useEditorContent;
