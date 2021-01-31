import * as React from 'react'
import { ResponsiveSankey } from '@nivo/sankey'
import { CSEScore } from 'Shared/data';

const colors = (d: any) => d.color;

interface Props {
    cseScore: CSEScore
}

interface NodeType {
    id: string,
    label: string,
    color: string
}

interface LinkType {
    source: string,
    target: string,
    value: number,
    color: string
}

export default class CSEFlow extends React.Component<Props> {
    public render() {
        const { cseScore } = this.props

        const nodes: NodeType[] = [] 
        const links: LinkType[] = []
        const nodeIds = new Set()
        cseScore.parts.forEach(p => {
            const scoreLabel = p.scoreGroupLabel
            const scoreId = `score-${p.scoreGroupLabel}`
            if (!nodeIds.has(scoreId)){
                nodes.push({
                    id: scoreId,
                    label: scoreLabel,
                    color: p.scoreGroupColor
                })
                nodeIds.add(scoreId)
            }            
            const cseLabel = p.cseGroupLabel
            const cseId = `cse-${p.cseGroupLabel}`
            if (!nodeIds.has(cseId)) {
                nodes.push({
                    id: cseId,
                    label: cseLabel,
                    color: p.cseGroupColor
                })
                nodeIds.add(cseId)
            }
            links.push({
                source: scoreId,
                target: cseId,
                value: p.percentage,
                color: ''
            })
        })

        const CSEFlowData: { nodes: NodeType[], links: LinkType[] } = { nodes, links }


        return (
            <div
                style={{
                    height: 200,
                    //width: '50%',
                    minWidth: 500
                }}
            >
                <ResponsiveSankey
                    data={CSEFlowData}
                    margin={{ top: 20, right: 180, bottom: 20, left: 120 }}
                    align="justify"
                    colors = {colors}
                    nodeOpacity={1}
                    nodeThickness={12}
                    nodeInnerPadding={3}
                    nodeSpacing={24}
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
                    //nodeTooltip={node => <span>{node.label}: {(node as unknown as {value: number}).value} deelnemers</span>}
                    linkTooltip={node => (
                    <span>
                        {node.value}% van de deelnemers met {node.source.label}
                    </span>
                    )}
                /></div>
        )

    }
}