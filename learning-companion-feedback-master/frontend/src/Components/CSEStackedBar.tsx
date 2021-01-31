import * as React from 'react'
import { ResponsiveBar } from '@nivo/bar';
import { CSEScore } from 'Shared/data';

interface Props {
    cseScore: CSEScore
    highlightedScoreGroup?: string 
}

interface DataItem {
    score: string
    values: {
        [label: string]: number
    }
}

export default function CSEStackedBar(props: Props) {
    const { cseScore, highlightedScoreGroup } = props

    const dataItems: DataItem[] = []
    const nodeIds = new Set()
    cseScore.parts.forEach(p => {
        const scoreLabel = p.scoreGroupLabel
        const scoreId = `score-${p.scoreGroupLabel}`
        if (!nodeIds.has(scoreId)) {
            dataItems.push({
                score: scoreLabel,
                values: {}
            })
            nodeIds.add(scoreId)
        }
        const cseLabel = p.cseGroupLabel
        const dataItem = dataItems.filter(d => d.score === scoreLabel)[0]
        dataItem.values[cseLabel] = p.percentage    
   
    })
    const keys = Object.keys(dataItems[0].values)
    const colors = keys.map(k => cseScore.parts.find(c => c.cseGroupLabel === k)!.cseGroupColor)

    return (<div
        style={{
            height: 300,
            width: '100%',
            margin: 'auto'
        }}
    ><ResponsiveBar
        data={dataItems.map(d => ({score: d.score, ...d.values}))}
        keys={keys}
        indexBy='score'
        margin={{ top: 30, right: 30, bottom: 60, left: 30 }}
        padding={0.1}
        colors={colors}   
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'scoregroep',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'aantal deelnemers',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 50,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        animate={true}
        borderWidth={1}
        {...({borderColor: (input: any) => { // Use this destructuring because borderColor property doesn't exist according to (faulty) typings
            if(input.data.indexValue === highlightedScoreGroup)
                return "rgb(0,0,255)"
            else
                return "rgba(0,0,0,0)"
        }})}
    />
    </div>)
}