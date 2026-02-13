'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate-common/react';

import { useCreateEditor } from '@/components/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
// import { ConsoleLogHtmlButton } from './button-html';

export function PlateEditor() {
  const editor = useCreateEditor({});
  const [content, setContent] = useState('');
  const [debouncedContent, setDebouncedContent] = useState('');
  // const editorValues = useRef('')

  // // Debounce logic to update debouncedContent
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedContent(content);
    }, 500); // Adjust delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [content]);

  const handleChange = useCallback(() => {
    const editorContent = editor?.children;
    if (editorContent) {
      setContent(JSON.stringify(editorContent));
    }
  }, [editor]);

  const editorValues = useRef<string>('');

  // const handleChange = (options: {
  //   editor: TPlateEditor;
  //   value: any;
  // }) => {
  //   // Update the useRef value with the editor's content
  //   const serializedValue = JSON.stringify(options.value); // Adjust serialization as needed
  //   editorValues.current = serializedValue;

  //   console.log('Updated editor value:', editorValues.current);
  // };



  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Plate editor={editor} onChange={handleChange}>
          <EditorContainer>
            <Editor variant="fullWidth" />
          </EditorContainer>
          {/* <ConsoleLogHtmlButton /> */}
        </Plate>
      </DndProvider>
      <div>
        <h3>Content:</h3>
        <pre>{content}</pre>
        <h3>Debounced Content:</h3>
        <pre>{debouncedContent}</pre>
        <pre>{editorValues.current}</pre>
      </div>
    </>

  );
}
