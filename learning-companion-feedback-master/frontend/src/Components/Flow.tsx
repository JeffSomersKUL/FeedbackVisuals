import * as React from 'react'
import { ResponsiveSankey } from '@nivo/sankey'

const data = {
    "nodes": [
        {
            "id": "posTest",
            "label": "Deelname aan ijkingstoets",
            "color": "rgba(254,254,0, 1)",
            "value": 408
        },
        {
            "id": "topgroup",
            "label": "Meer dan 13 op 20",
            "color": "rgba(30,255,30,1)",
            "value": 88
        },
        {
            "id": "middlegroup",
            "label": "Van 8 op 20 tot en met 13 op 20",
            "color": "rgba(0,0,255,0.3)",
            "value": 258
        },
        {
            "id": "bottomgroup",
            "label": "Minder dan 8 op 20",
            "color": "rgba(255,0,0,0.3)",
            "value": 62
        },
        {
            "id": "topgroupCSE",
            "label": "CSE van meer dan 80%",
            "color": "rgba(0,255,0,0.3)",
            "value": 45 + 66 + 2
        },
        {
            "id": "middlegroupCSE",
            "label": "CSE van 30% tot en met 80%",
            "color": "rgba(0,0,255,0.3)",
            "value": 34 + 83 + 10
        },
        {
            "id": "bottomgroupCSE",
            "label": "CSE van minder dan 30%",
            "color": "rgba(255,0,0,0.3)",
            "value": 6 + 69 + 24
        },
        {
            "id": "dropout",
            "label": "Gestopt voor januari",
            "color": "rgb(0,0,0,0.3)",
            "value": 3 + 7 + 4
        },
        {
            "id": "no-enrolment",
            "label": "niet ingeschreven",
            "color": "rgba(100,100,100,0.3)",
            "value": 33 + 22
        },
    ],
    "links": [
        {
            "source": "posTest",
            "target": "topgroup",
            "value": 88,
            "color": "rgb(255,255,0)",
            "label": "test"
        },
        {
            "source": "posTest",
            "target": "middlegroup",
            "value": 258,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "posTest",
            "target": "bottomgroup",
            "value": 62,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "topgroup",
            "target": "topgroupCSE",
            "value": 45,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "topgroup",
            "target": "middlegroupCSE",
            "value": 34,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "topgroup",
            "target": "bottomgroupCSE",
            "value": 6,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "topgroup",
            "target": "dropout",
            "value": 3,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "middlegroup",
            "target": "topgroupCSE",
            "value": 66,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "middlegroup",
            "target": "middlegroupCSE",
            "value": 83,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "middlegroup",
            "target": "bottomgroupCSE",
            "value": 69,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "middlegroup",
            "target": "dropout",
            "value": 7,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "middlegroup",
            "target": "no-enrolment",
            "value": 33,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "bottomgroup",
            "target": "topgroupCSE",
            "value": 2,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "bottomgroup",
            "target": "middlegroupCSE",
            "value": 10,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "bottomgroup",
            "target": "bottomgroupCSE",
            "value": 24,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "bottomgroup",
            "target": "dropout",
            "value": 4,
            "color": "rgb(255,255,0)"
        },
        {
            "source": "bottomgroup",
            "target": "no-enrolment",
            "value": 22,
            "color": "rgb(255,255,0)"
        },
        
    ]
}

const colors = (d: any) => d.color;

export default class Flow extends React.Component {
    public render() {
        return (
            <div
                style={{
                    height: 700,
                }}
            >
                <ResponsiveSankey
                    data={data}
                    margin={{ top: 40, right: 300, bottom: 40, left: 300 }}
                    align="justify"
                    //colors={{ scheme: 'category10' }}
                    colors = {colors}
                    nodeOpacity={1}
                    nodeThickness={18}
                    nodeInnerPadding={3}
                    nodeSpacing={48}
                    nodeBorderWidth={0}
                    nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
                    label={node => node.label}
                    linkOpacity={0.5}
                    linkHoverOthersOpacity={0.1}
                    linkBlendMode="normal"
                    enableLinkGradient={true}
                    labelPosition="outside"
                    labelOrientation="horizontal"
                    labelPadding={16}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
                    nodeTooltip={node => <span>{node.label}: {(node as unknown as {value: number}).value} deelnemers</span>}
                    linkTooltip={node => (
                    <span>
                        {node.value} van de {(node.source as unknown as {value: number}).value} deelnemers ({Math.round(10000 * node.value / (node.source as unknown as {value: number}).value)/ 100}%)
                    </span>
                    )}
                    /*motion={
                        {
                            motionStiffness: 140,
                            motionDamping: 13
                        }
                    }*/
                    /*legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            translateX: 200,
                            itemWidth: 100,
                            itemHeight: 14,
                            itemDirection: 'right-to-left',
                            itemsSpacing: 2,
                            itemTextColor: '#999',
                            symbolSize: 14,
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
                /></div>
        )

    }
}