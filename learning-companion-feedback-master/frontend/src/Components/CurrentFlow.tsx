import * as React from 'react'
import { ResponsiveSankey } from '@nivo/sankey'

const colors = (d: any) => d.color;

interface Props {
    currentFlowData: { nodes: any[], links: any[] }
}

export default class CurrentFlow extends React.Component<Props> {
    public render() {
        const { currentFlowData } = this.props

        return (
            <div
                style={{
                    height: 200,
                    width: '50%',
                    minWidth: 500
                }}
            >
                <ResponsiveSankey
                    data={currentFlowData}
                    margin={{ top: 20, right: 100, bottom: 20, left: 150 }}
                    align="justify"
                    colors = {colors}
                    nodeThickness={12}
                    nodeInnerPadding={3}
                    nodeSpacing={24}
                    nodeBorderWidth={0}
                    nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
                    label={node => node.label}
                    linkOpacity={0.5}
                    linkHoverOthersOpacity={0.1}
                    linkBlendMode="normal"
                    //enableLinkGradient={true}
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
                /></div>
        )

    }
}