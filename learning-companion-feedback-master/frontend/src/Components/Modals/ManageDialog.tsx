import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';
import { DashboardStep } from 'Components/DashboardStepped';
import { AppBar, Tabs, Tab, Paper, Typography, TextField, FormControlLabel, Switch } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete'
import { IconButton } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/tomorrow';
import MarkdownParser from 'Templating/MarkdownParser';

interface Props {
    dashboardSteps: DashboardStep[]
    open: boolean
    onClose?: () => void
    handleApply: (s: DashboardStep[]) => void
}

const validDataOrder = (steps: DashboardStep[]): boolean => {
    return steps.filter(s => s.visible).map(s => s.subSteps.filter(ss => ss.visible).map(s => { return { needsData: MarkdownParser.needsData(s), providesData: MarkdownParser.providesData(s) } })).reduce((acc, val) => acc.concat(val), [])
        .reduce((acc, stepData) => {
            if(acc.done)
                return acc
            if(stepData.needsData){
                return {
                    done: true,
                    result: false
                }
            }
            else if(stepData.providesData){
                return {
                    done: true,
                    result: true
                }
            }
            return acc
        }, {done: false, result: true }).result
}

export default function ManageDialog(props: Props) {
    const { dashboardSteps, open, onClose, handleApply } = props

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [selectedSubTab, setSelectedSubTab] = React.useState(0);
    const [changedDashboardSteps, setChangedDashboardSteps] = React.useState<DashboardStep[]>(dashboardSteps)

    const validOrder = validDataOrder(changedDashboardSteps)

    const handleClose = () => {
        if (onClose)
            onClose();
    }

    const handleStepChange = (event: any, value: number) => {
        setSelectedSubTab(0)
        setSelectedTab(value)
    }

    const handleSubStepChange = (event: any, value: number) => {
        setSelectedSubTab(value)
    }

    const onSubStepSortEnd = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
        const updatedStep = arrayMove(changedDashboardSteps[selectedTab].subSteps, oldIndex, newIndex)
        setChangedDashboardSteps(changedDashboardSteps.map((item, index) => {
            if(index === selectedTab){
                return {
                    ...item,
                    subSteps: updatedStep
                }
            }
            return item
        }))
        setSelectedSubTab(newIndex)
    };

    const onStepSortEnd = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
        const updatedStep = arrayMove(changedDashboardSteps, oldIndex, newIndex)
        setChangedDashboardSteps(updatedStep)
        setSelectedSubTab(0)
        setSelectedTab(newIndex)

    };

    const updateCurrentMd = (value: string) => {
        setChangedDashboardSteps(changedDashboardSteps.map((item, index) => {
            if (index === selectedTab) {
                return {
                    ...item,
                    subSteps: item.subSteps.map((s, i) => {
                        if(i === selectedSubTab){
                            return {
                                ...s,
                                mdString: value
                            }
                        }
                        return s
                    })
                }
            }
            return item
        }))
    }

    const updateCurrentSubStepTitle = (value: string) => {
        setChangedDashboardSteps(changedDashboardSteps.map((item, index) => {
            if (index === selectedTab) {
                return {
                    ...item,
                    subSteps: item.subSteps.map((s, i) => {
                        if (i === selectedSubTab) {
                            return {
                                ...s,
                                title: value
                            }
                        }
                        return s
                    })
                }
            }
            return item
        }))
    }

    const toggleCurrentSubStep = (value: boolean) => {
        setChangedDashboardSteps(changedDashboardSteps.map((item, index) => {
            if (index === selectedTab) {
                return {
                    ...item,
                    subSteps: item.subSteps.map((s, i) => {
                        if (i === selectedSubTab) {
                            return {
                                ...s,
                                visible: value
                            }
                        }
                        return s
                    })
                }
            }
            return item
        }))
    }

    const updateCurrentStepTitle = (value: string) => {
        setChangedDashboardSteps(changedDashboardSteps.map((item, index) => {
            if (index === selectedTab) {
                return {
                    ...item,
                    title: value
                }
            }
            return item
        }))
    }

    const toggleCurrentStep = (value: boolean) => {
        setChangedDashboardSteps(changedDashboardSteps.map((item, index) => {
            if (index === selectedTab) {
                return {
                    ...item,
                    visible: value
                }
            }
            return item
        }))
    } 

    const deleteCurrentStep = () => {
        if(selectedTab ===  changedDashboardSteps.length - 1)
            setSelectedTab(prev => prev - 1)
        setChangedDashboardSteps(changedDashboardSteps.filter((item, index) => index !== selectedTab))
    }

    const addStep = () => {
        setChangedDashboardSteps([
            ...changedDashboardSteps.slice(0, selectedTab + 1),
            {
                title: 'Nieuw',
                subSteps: [{
                    title: 'Nieuw',
                    mdString: '###### Nieuw',
                    key: Math.random().toString(36).substring(2, 15),
                    visible: true
                }],
                visible: true
            },
            ...changedDashboardSteps.slice(selectedTab + 1)
        ])
        setSelectedTab(selectedTab + 1)
    }

    const addSubStep = () => {
        setChangedDashboardSteps(changedDashboardSteps.map((item, index) => {
            if (index === selectedTab) {
                return {
                    ...item,
                    subSteps: [...item.subSteps.slice(0, selectedSubTab + 1),
                        {
                            title: 'Nieuw',
                            mdString: '###### Nieuw',
                            key: Math.random().toString(36).substring(2, 15),
                            visible: true
                        },
                        ...item.subSteps.slice(selectedSubTab + 1)
                    ]
                }
            }
            return item
        }))
        setSelectedSubTab(selectedSubTab + 1)
    }

    const deleteCurrentSubStep = () => {
        if (selectedSubTab === changedDashboardSteps[selectedTab].subSteps.length - 1)
            setSelectedSubTab(prev => prev - 1)
        setChangedDashboardSteps(changedDashboardSteps.map((item, index) => {
            if (index === selectedTab) {
                return {
                    ...item,
                    subSteps: item.subSteps.filter((s, i) => i !== selectedSubTab)
                }
            }
            return item
        }))
    }

    const SortableItem = (label: string, visible: boolean) => SortableElement(() => <Tab label={label} style={{opacity: (visible) ? 1 : 0.2}} />);

    const SortableList = (onChange: any) =>  SortableContainer(({ items, value }: { items: any[], value: number }) => {
        return (
            <Tabs value={value} onChange={onChange} variant="scrollable">
                {
                 items.map((value, index) => { 
                     const Labeled = SortableItem(value.title, value.visible) 
                     return (<Labeled key={`item-${index}`} index={index} />)
                }
                )
            
                 }
            </Tabs>
            
        );
    });

    const SortableListTabs = SortableList(handleStepChange)
    const SortableListSubTabs = SortableList(handleSubStepChange)
    
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll='paper'
                aria-labelledby="scroll-dialog-title"
                fullScreen={fullScreen}
                maxWidth='md'
                data-cy='manage-dialog'
            >
                <DialogTitle id="scroll-dialog-title">Beheer dashboard</DialogTitle>
                <DialogContent dividers={true}>
                      <AppBar position="static" style={{minWidth:800}}>
                        <div style={{ display: 'flex'}}>
                            <SortableListTabs items={changedDashboardSteps.map(step => {return {title: step.title, visible: step.visible } })} value={selectedTab} axis='x' onSortEnd={onStepSortEnd} />
                            <IconButton onClick={() => addStep()}>
                                <AddIcon/>
                            </IconButton>
                        </div>
                       <Paper>
                            <form noValidate autoComplete="off" style={{ marginLeft: 20 }}>
                                <div style={{ display: 'flex' }}>
                                    <TextField
                                        label="Titel"
                                        value={changedDashboardSteps[selectedTab].title}
                                        margin="normal"
                                        onChange={(event) => updateCurrentStepTitle(event.target.value)} />
                                    <IconButton onClick={() => deleteCurrentStep()} disabled={changedDashboardSteps.length <= 1}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={changedDashboardSteps[selectedTab].visible}
                                                onChange={(e:any, v: boolean) => toggleCurrentStep(v)}
                                                disabled={changedDashboardSteps[selectedTab].visible && changedDashboardSteps.filter(step => step.visible).length <= 1}
                                                color="secondary"
                                            />
                                        }
                                        label="Zichtbaar"                                       
                                    />
                                </div>
                            </form>
                            <Paper style={{ padding: 5, background: grey[300] }}>
                                <div style={{ display: 'flex' }}>
                                    <SortableListSubTabs items={changedDashboardSteps[selectedTab].subSteps.map(step => { return { title: step.title, visible: step.visible } })} value={selectedSubTab} axis='x' onSortEnd={onSubStepSortEnd} />
                                    <IconButton onClick={() => addSubStep()}>
                                        <AddIcon />
                                    </IconButton>
                                </div>
                                <Paper style={{padding: 5}}>
                                    <form noValidate autoComplete="off" style={{margin: 20}}>
                                        <div style={{ display: 'flex' }}>
                                        <TextField 
                                            label="Titel"
                                            value={changedDashboardSteps[selectedTab].subSteps[selectedSubTab].title} 
                                            margin="normal"
                                            fullWidth
                                            onChange={(event) => updateCurrentSubStepTitle(event.target.value)}/>
                                            <IconButton onClick={() => deleteCurrentSubStep()} disabled={changedDashboardSteps[selectedTab].subSteps.length <= 1}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={changedDashboardSteps[selectedTab].subSteps[selectedSubTab].visible}
                                                        onChange={(e: any, v: boolean) => toggleCurrentSubStep(v)}
                                                        disabled={changedDashboardSteps[selectedTab].subSteps[selectedSubTab].visible && changedDashboardSteps[selectedTab].subSteps.filter(step => step.visible).length <= 1}
                                                        color="secondary"
                                                    />
                                                }
                                                label="Zichtbaar"
                                            />
                                        </div>
                                        <AceEditor
                                            mode="markdown"
                                            theme="tomorrow"
                                            height='250px'
                                            width='90%'
                                            onChange={updateCurrentMd}
                                            value={changedDashboardSteps[selectedTab].subSteps[selectedSubTab].mdString}
                                            name="md_editor"
                                            wrapEnabled={true}
                                            highlightActiveLine={true}
                                            editorProps={{ $blockScrolling: true }}
                                        />
                                    
                                    </form>
                                </Paper>
                            </Paper>
                        </Paper>
                    </AppBar>
                </DialogContent>
                <DialogActions>
                    {!validOrder &&
                        <Typography component="h1" variant="h6" color="error">
                            Er wordt data gebruikt van de gebruiker voordat de feedbackcode is ingevuld.
                        </Typography>
                    }
                    { JSON.stringify(dashboardSteps) !== JSON.stringify(changedDashboardSteps) && 
                    <Button onClick={() => handleApply(changedDashboardSteps)} color="secondary" disabled={!validOrder}>
                        Toepassen
                    </Button>
                    }
                    <Button onClick={handleClose} color="primary" data-cy='manage-dialog-close'>
                        Sluit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}