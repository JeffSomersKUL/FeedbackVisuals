import React, { useState } from 'react';
import { ProcessedData, FeedbackCodeInfo, AnswerData, ISubScore } from "Shared/data";
import MarkdownParser from 'Templating/MarkdownParser';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import AspectRatioIcon from '@material-ui/icons/AspectRatio'
import { IconButton } from '@material-ui/core';

import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/tomorrow';
import 'brace/ext/language_tools'
import ace from 'brace'
let langTools = ace.acequire('ace/ext/language_tools');
const commandCompleter = {
    getCompletions: (editor: any, session: any, pos: any, prefix: any, callback: any) => {
        if (prefix.length === 0) { callback(null, []); return }
        const toItem = (v: {name: string, description: string}) => {
            return {
                caption: v.description,
                value: v.name,
                //meta: 'static'
            }
        }
        var wordList = [...MarkdownParser.supportedVariables().map(toItem), ...MarkdownParser.supportedVisualisations().map(toItem)]
        callback(null, wordList);
    }
}
langTools.addCompleter(commandCompleter);


interface Props {
    mdString: string
    data: ProcessedData
    classes: any
    showQuestion: (a: AnswerData, s: ISubScore) => void
    handleFeedbackCode: any
    feedbackCodeInfo: FeedbackCodeInfo
    canEdit: boolean
    stepKey: string
    updateMd: (key: string, md: string) => void
}

export default function EditableMarkdownComponent(props: Props) {
    const { mdString, data, classes, showQuestion, canEdit, handleFeedbackCode, feedbackCodeInfo, stepKey, updateMd } = props

    const [editing, setEditing] = useState(false)
    const [md, setMd] = useState(mdString)
    const [savedKey, setSavedKey] = useState(stepKey)
    if(savedKey !== stepKey){
        setSavedKey(stepKey)
        setMd(mdString)
    }

    const handleSave = () => {
        updateMd(savedKey, md)
    }
   

    const viewContent = (
        <div style={{ position: 'relative' }}>
            {MarkdownParser.parse(md, data, classes, showQuestion, handleFeedbackCode, feedbackCodeInfo)}
            {canEdit &&
                <IconButton style={{
                    position: 'absolute', top: 5, right: 5
                }} onClick={() => setEditing(true)} data-cy='edit-button'>
                    <EditIcon />
                </IconButton>
            }
            {canEdit && md !== mdString &&
                <IconButton style={{
                    position: 'absolute', top: 50, right: 5
                }} onClick={() => handleSave()}>
                    <SaveIcon />
                </IconButton>
            }
        </div>)

    const editContent = (<div style={{ position: 'relative' }}>
        <AceEditor
            mode="markdown"
            theme="tomorrow"
            height='250px'
            width='90%'
            onChange={(value) => setMd(value)}
            value={md}
            name="md_editor"
            wrapEnabled={true}
            highlightActiveLine={true}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true
            }}
        />
        <IconButton style={{
            position: 'absolute', top: 5, right: 5
        }} onClick={() => setEditing(false)}>
            <AspectRatioIcon />
        </IconButton>
        { md !== mdString && <IconButton style={{
            position: 'absolute', top: 50, right: 5
        }} onClick={() => handleSave()}>
            <SaveIcon />
    </IconButton> }
    </div>)

    const content = (!(canEdit && editing)) ? viewContent : editContent
    return (content);
}