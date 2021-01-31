import React, { useState } from 'react';
import FileInput from './FileInput';
import { Button } from '@material-ui/core';

const uploadFiles = (code: string, session: number, program: string, files: FileList) => {
    let data = new FormData();

    for (const fileIndex of Object.keys(files)) {
        const file = files[fileIndex as any]
        data.append('feedbackFiles', file, file.name);
    }

    return fetch(`/upload/feedbackFiles/${session}/${program}`, {
            method: 'POST',
            headers: {
                'X-FeedbackCode': code,
            },
            body: data,
    })  
}

interface Props {
    code: string
    session: number
    program: string
    changeLoading: (loading: boolean) => void
}

export default function FeedbackFileSubmit(props: Props) {
    const [files, setFiles] = useState<FileList| null>(null)
    const [key, setKey] = useState<number>(0)

    const handleSubmit = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if(files){
            props.changeLoading(true)
            uploadFiles(props.code, props.session, props.program, files).then(() => {
                setFiles(null)
                setKey(k => k + 1)
                props.changeLoading(false)
            }).catch(error => console.log(error));
        }
    }

    return (<React.Fragment>
        <FileInput multiple inputKey={key} files={files} onFilesChange={(files) => setFiles(files)} />
        {files && <Button disabled={!files || Object.keys(files).length === 0} onClick={handleSubmit}>Submit</Button>}
    </React.Fragment>);
}
