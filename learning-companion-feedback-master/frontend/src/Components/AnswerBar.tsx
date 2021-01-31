import * as React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { AnswerData } from '../Shared/data'
import { Tooltip } from '@material-ui/core'

interface Props {
    answer: AnswerData
}

// See https://github.com/plouc/nivo/blob/v0.59.2/packages/bar/src/BarItem.js
const customBarItem = (answer: AnswerData) => ({
    data,

    x,
    y,
    width,
    height,
    borderRadius,
    color,
    borderWidth,
    borderColor,

    label,
    shouldRenderLabel,
    labelColor,

    showTooltip,
    hideTooltip,
    onClick,
    onMouseEnter,
    onMouseLeave,
    tooltip,
    getTooltipLabel,
    tooltipFormat,

    theme,
}: any) => {
    let deelnemersText = (answer.givenAnswer === data.id) ? `deelnemers (inclusief jij)` : `deelnemers`
    let text = ''
    let fill: string
    if(answer.correctAnswer === data.id){
        fill = '#00FF00'
        text = `${data.value} ${deelnemersText} selecteerden optie ${data.id}, het juiste antwoord`
    }
    else if(data.id === 'X'){
        fill = '#aaaaaa'
        text= `${data.value} ${deelnemersText} lieten deze vraag open`
    }
    else{
        fill = color
        text = `${data.value} ${deelnemersText} selecteerden optie ${data.id}, een fout antwoord`
    }
    
    let pattern: string = 'transparent'
    if(answer.givenAnswer === data.id){
        if(answer.correctAnswer === data.id)
            pattern = `url(#green-dots)`
        else
            pattern = `url(#red-dots)`
    }
        

    return (<Tooltip title={text}>
        <g transform={`translate(${x}, ${y})`}>
            <rect
                width={width}
                height={height}
                rx={borderRadius}
                ry={borderRadius}
                fill={fill}
                strokeWidth={borderWidth}
                stroke={borderColor}
                
                onClick={onClick}
            />
            <rect
                width={width}
                height={height}
                rx={borderRadius}
                ry={borderRadius}
                fill={pattern}
                strokeWidth={borderWidth}
                stroke={borderColor}
                onClick={onClick}
            />
            {shouldRenderLabel && (
                <text
                    x={width / 2}
                    y={height / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                        ...theme.labels.text,
                        pointerEvents: 'none',
                        fill: labelColor,
                    }}
                >
                    {label}
                </text>
            )}
        </g></Tooltip>
    )
}

export default class AnswerBar extends React.Component<Props> {

    public render() {
        const { answer } = this.props
        const barData = [
            {
                "question": `${answer.questionId}`,
                ...answer.allAnswers
              }
        ]
        return (
            <div
                style={{
                    height:30,
                    width: '100%',
                    margin: 'auto'
                }}
            >
                <ResponsiveBar
                    colors={{ scheme: "reds"}}
                    data={barData}
                    keys={[ 'A', 'B', 'C', 'D', 'X' ]} // TODO E?
                    indexBy="question"
                    layout="horizontal"
                    enableGridY={false}
                    enableGridX={false}
                    axisLeft={null}
                    labelSkipWidth={30}
                    label={d => `${(d.id === 'X') ? (d.value > 60 ? 'Blanco': '/'): d.id}: ${d.value}`}
                    theme={{
                    tooltip: {
                        container: {
                        background: '#aaa',
                        },
                    },
                    }}
                    barComponent={customBarItem(answer)}
                    defs={[
                        {
                            id: 'red-dots',
                            type: 'patternDots',
                            background: 'transparent',
                            color: '#ff000020',
                            size: 10,
                            padding: 1,
                            stagger: true
                        },
                        {
                            id: 'green-dots',
                            type: 'patternDots',
                            background: 'transparent',
                            color: '#00aa0020',
                            size: 10,
                            padding: 1,
                            stagger: true
                        }
                    ]}
                />
            </div>
        )
    }
}