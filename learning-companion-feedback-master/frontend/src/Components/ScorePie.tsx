import * as React from 'react'
import { ResponsivePie } from '@nivo/pie'
import { IjkingstoetsScore } from 'Shared/data';

const margin = { top: 20, right: 20, bottom: 20, left: 20 };

const styles: {[s: string]: React.CSSProperties} = {
    root: {
        fontFamily: "consolas, sans-serif",
        textAlign: "center",
        position: "relative",
    },
    overlay: {
        position: "absolute",
        top: margin.top,
        right: margin.right,
        bottom: margin.bottom,
        left: margin.left,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#000000",
        //background: "#FFFFFF33",
        textAlign: "center",
        // This is important to preserve the chart interactivity
        pointerEvents: "none"
    }
};

const colors = (d: any) => d.color;

interface Props {
    ijkingstoetsScore: IjkingstoetsScore
    height: number
}

const colorScale = ['#FF0000', '#CC0000', '#990000', '#666600', '#336600', '#4C9900', '#66CC00']

export default class ScorePie extends React.Component<Props> {
    public render() {
        const { ijkingstoetsScore, height } = this.props
        const pieData = (ijkingstoetsScore.hasBreakdown) ? [
            {
                "id": "juist",
                "label": "juist",
                "value": ijkingstoetsScore.numberCorrect!,
                "color": "rgba(0, 255, 0, 0.3)"
            },
            {
                "id": "fout",
                "label": "fout",
                "value": ijkingstoetsScore.numberWrong!,
                "color": "rgba(255, 0, 0, 0.3)"
            },
            {
                "id": "niet ingevuld",
                "label": "niet ingevuld",
                "value": ijkingstoetsScore.numberBlanco!,
                "color": "rgba(100,100,100,0.3)"
            }
        ] : [
                {
                    "id": "juist",
                    "label": "",
                    "value": ijkingstoetsScore.score,
                    "color": "rgba(0, 255, 0, 0.3)"
                },
                {
                    "id": "fout",
                    "label": "",
                    "value": ijkingstoetsScore.maxScore - ijkingstoetsScore.score,
                    "color": "rgba(255, 0, 0, 0.3)"
                }
            ]
        return (
            <div
                style={{
                    ...styles.root,
                    height
                }}
            >
                <ResponsivePie
                    data={pieData}
                    margin={margin}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors={colors}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    enableRadialLabels={false}
                    slicesLabelsSkipAngle={10}
                    slicesLabelsTextColor="#333333"
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    /*legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            translateY: 56,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: '#999',
                            symbolSize: 18,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000'
                                    }
                                }
                            ]
                        }
                    ]}*/
                />
                <div style={{...styles.overlay}}>
                    <span style={{ fontSize: 50,  color: colorScale[Math.floor(6 * ijkingstoetsScore.score / ijkingstoetsScore.maxScore)]}}>{ijkingstoetsScore.score}</span>
                    <span style={{ fontSize: 12, color: 'grey', marginTop: -10 }}>op {ijkingstoetsScore.maxScore}</span>
                </div>
            </div>
        )
    }
}