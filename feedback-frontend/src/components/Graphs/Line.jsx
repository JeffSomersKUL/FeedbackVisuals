// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/line
import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyLine = ({ data /* see data tab */ }) => {
    const testdata = [
        {
          "id": "japan",
          "data": [
            {
              "x": "plane",
              "y": 296
            },
            {
              "x": "helicopter",
              "y": 25
            },
            {
              "x": "boat",
              "y": 182
            },
            {
              "x": "train",
              "y": 290
            },
            {
              "x": "subway",
              "y": 175
            },
            {
              "x": "bus",
              "y": 20
            },
            {
              "x": "car",
              "y": 269
            },
            {
              "x": "moto",
              "y": 191
            },
            {
              "x": "bicycle",
              "y": 216
            },
            {
              "x": "horse",
              "y": 197
            },
            {
              "x": "skateboard",
              "y": 125
            },
            {
              "x": "others",
              "y": 212
            }
          ]
        },
        {
          "id": "france",
          "data": [
            {
              "x": "plane",
              "y": 47
            },
            {
              "x": "helicopter",
              "y": 82
            },
            {
              "x": "boat",
              "y": 62
            },
            {
              "x": "train",
              "y": 126
            },
            {
              "x": "subway",
              "y": 35
            },
            {
              "x": "bus",
              "y": 261
            },
            {
              "x": "car",
              "y": 262
            },
            {
              "x": "moto",
              "y": 147
            },
            {
              "x": "bicycle",
              "y": 84
            },
            {
              "x": "horse",
              "y": 215
            },
            {
              "x": "skateboard",
              "y": 18
            },
            {
              "x": "others",
              "y": 7
            }
          ]
        }
      ]
    return (<ResponsiveLine
        data={testdata}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        yFormat=" >-.2f"
        curve="natural"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'transportation',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'count',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        colors={{ scheme: 'nivo' }}
        pointSize={10}
        pointColor={{ from: 'color', modifiers: [] }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor', modifiers: [] }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
    )
}

MyLine.propTypes={
    data:PropTypes.array
};

export default MyLine;