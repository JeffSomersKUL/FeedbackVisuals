import React from 'react';

interface Props {
    multiple?: boolean
    onFilesChange: (files: FileList | null) => void
    files: FileList | null
    inputKey: number
}

export default function FileInput(props: Props) {
    const fileInput = React.createRef<HTMLInputElement>();
    
    const handleFileChange = (_event : React.ChangeEvent<HTMLInputElement>) => {
        props.onFilesChange(fileInput!.current!.files)
    }

    return (<input key={props.inputKey} type="file" multiple={props.multiple} onChange={handleFileChange} ref={fileInput} />);
}
