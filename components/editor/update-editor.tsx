'use client';

import React, { useRef } from 'react';
import { Plate, TPlateEditor } from '@udecode/plate-common/react';
import { useCreateEditor } from '@/components/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { debounce } from 'lodash';

interface PlateEditorProps {
    initialValue: any;
    onChange: (value: string) => void;
}

export default function PlateEditor({ initialValue, onChange }: PlateEditorProps) {
    const editor = useCreateEditor({
        initialValue: initialValue
    });

    const editorValues = useRef<string>('');

    const handleChange = debounce((options: { editor: TPlateEditor; value: any }) => {
        const serializedValue = options.value;
        editorValues.current = serializedValue;
        onChange(serializedValue);
    }, 300);

    return (
        <Plate editor={editor} onChange={handleChange}>
            <EditorContainer>
                <Editor variant='fullWidth' />
            </EditorContainer>
        </Plate>
    );
}