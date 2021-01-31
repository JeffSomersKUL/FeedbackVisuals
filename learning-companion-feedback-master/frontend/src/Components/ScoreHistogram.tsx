import * as React from 'react'
import { SubScoreStatistics } from 'Shared/data';
import { ResponsiveBar } from '@nivo/bar';

interface Props {
    scores: SubScoreStatistics
    userScore: number
}

export function createBarDataItem(name: number, value: number, color: string) {
    return { name: `${name}`, value, color }
}

export default function ScoreHistogram(props: Props) {
    const { scores, userScore } = props
    const data = scores.scoreAmounts.map(a => createBarDataItem(a.score, a.amount,"rgb(0,180,255)"))
    data.sort((d1, d2) => Number(d1.name) - Number(d2.name))

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
            margin={{ top: 30, right: 30, bottom: 60, left: 50 }}
            padding={0.1}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'score',
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
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            animate={true}
            borderWidth={1}
            {...({
                borderColor: (input: any) => { // Use this destructuring because borderColor property doesn't exist according to (faulty) typings
                    if (input.data.indexValue === `${userScore}`)
                        return "rgb(0,0,255)"
                    else
                        return "rgba(0,0,0,0)"
                }
            })}
        />
    </div>)
}