import * as React from 'react'
import { PeerScore } from 'Shared/data';
import CurrentFlow from './CurrentFlow'

interface Props {
    peerScore: PeerScore
}

export default class PeerCurrentFlow extends React.Component<Props> {
    public render() {
        const { peerScore } = this.props
        const mainSourceNode = {
            id: "___home___",
            label: "Deelnemers ijkingstoets",
            color: "rgb(254,254,0)"
        }

        const currentFlowData = peerScore.parts.map(p => {
            return {
                node: { 
                    id: p.label,
                    label: p.label,
                    color: p.color
                },
                link: {
                    source: mainSourceNode.id,
                    target: p.label,
                    value: p.amount,
                    color: p.color
                }
            }
        }).reduce((acc, elem) => {
            return {
                nodes: acc.nodes.concat(elem.node),
                links: acc.links.concat(elem.link)
            }
        }, {nodes: [mainSourceNode], links: [] as { source: string, target: string, value: number, color: string}[] })

        // const currentFlowData = {
        //     nodes: [
        //         {
        //             "id": "posTest",
        //             "label": "Deelnemers ijkingstoets",
        //             "color": "rgb(254,254,0)"
        //         },
        //         {
        //             "id": "topgroup",
        //             "label": lmhPeerScore.highLabel, //"Meer dan 13 op 20",
        //             "color": getTopColor(),
        //         },
        //         {
        //             "id": "middlegroup",
        //             "label": lmhPeerScore.middleLabel, //"Van 8 op 20 tot en met 13 op 20",
        //             "color": getMiddleColor(), // TODO: check 'midden'
        //         },
        //         {
        //             "id": "bottomgroup",
        //             "label": lmhPeerScore.lowLabel, // "Minder dan 8 op 20",
        //             "color": getBottomColor(), // TODO: check 'laag'
        //         }
        //     ],
        //     links: [
        //         {
        //             "source": "posTest",
        //             "target": "topgroup",
        //             "value": lmhPeerScore.amountHigh,
        //             "color": getTopColor((lmhPeerScore.studentGroup === 'hoog') ? 1 : 0.2)
        //         },
        //         {
        //             "source": "posTest",
        //             "target": "middlegroup",
        //             "value": lmhPeerScore.amountMiddle,
        //             "color": getMiddleColor((lmhPeerScore.studentGroup === 'midden') ? 1 : 0.2)
        //         },
        //         {
        //             "source": "posTest",
        //             "target": "bottomgroup",
        //             "value": lmhPeerScore.amountLow,
        //             "color": getBottomColor((lmhPeerScore.studentGroup === 'laag') ? 1 : 0.2)
        //         }
        //     ]
        // }


        return (<CurrentFlow currentFlowData={currentFlowData}></CurrentFlow>)

    }
}