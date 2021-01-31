import * as React from 'react'
import { PeerScore } from 'Shared/data';
import { ResponsiveBar } from '@nivo/bar';

interface Props {
    peerScore: PeerScore
    highlightedScoreGroup?: string
}

export function createBarDataItem(name: string, value: number, color: string) {
    return { name, value, color }
}

export default function PeerCurrentBar(props: Props) {
    const { peerScore, highlightedScoreGroup } = props
    const data = peerScore.parts.map(p => createBarDataItem(p.label, p.amount,p.color))

    return (<div
        style={{
            height: 300,
            width: '100%',
            margin: 'auto'
        }}
    ><ResponsiveBar
            data={data}
            colors={({ datum: 'data.color' })}
            indexBy='name'
            margin={{ top: 30, right: 30, bottom: 50, left: 50 }}
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
            padding={0.1}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            animate={true}
            borderWidth={1}
            {...({
                borderColor: (input: any) => { // Use this destructuring because borderColor property doesn't exist according to (faulty) typings
                    if (input.data.indexValue === highlightedScoreGroup)
                        return "rgb(0,0,255)"
                    else
                        return "rgba(0,0,0,0)"
                }
            })}
        />
    </div>)
}