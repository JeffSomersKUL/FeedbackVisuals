// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const QuestionBar = ({ tdata /* see data tab */ }) => {
    const data = [
        {
          "vraag": "Vraag 1",
          "A": 122,
          //"hot dogColor": "hsl(94, 70%, 50%)",
          "B": 118,
          //"burgerColor": "hsl(182, 70%, 50%)",
          "C": 24,
          //"sandwichColor": "hsl(262, 70%, 50%)",
          "D": 139
          //"kebabColor": "hsl(20, 70%, 50%)",
        },
        {
          "vraag": "Vraag 2",
          "A": 126,
          //"hot dogColor": "hsl(0, 70%, 50%)",
          "B": 131,
          //"burgerColor": "hsl(50, 70%, 50%)",
          "C": 81,
          "sandwichColor": "hsl(101, 70%, 50%)",
          "D": 105,
          "kebabColor": "hsl(193, 70%, 50%)"
        },
        {
          "vraag": "Vraag 3",
          "A": 52,
          "hot dogColor": "hsl(255, 70%, 50%)",
          "B": 9,
          "burgerColor": "hsl(75, 70%, 50%)",
          "C": 37,
          "sandwichColor": "hsl(49, 70%, 50%)",
          "D": 120,
        },
        {
          "vraag": "Vraag 4",
          "A": 113,
          "hot dogColor": "hsl(197, 70%, 50%)",
          "B": 199,
          "burgerColor": "hsl(27, 70%, 50%)",
          "C": 112,
          "sandwichColor": "hsl(193, 70%, 50%)",
          "D": 139,
          "kebabColor": "hsl(331, 70%, 50%)",
        }
      ]
    
    const colorCode = {'A':'red' ,'Vraag 2':'blue' ,'Vraag 3': 'blue','Vraag 4': 'blue'}
    const getColor = bar => colorCode[bar.id]
    return (
    <ResponsiveBar
        data={data}
        keys={[ 'A', 'B', 'C', 'D']}
        indexBy="vraag"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.25}
        groupMode="grouped"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{scheme:'nivo'}}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', '1.6' ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Aantal Studenten',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', '1.4' ] ] }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
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
        motionStiffness={90}
        motionDamping={15}
    />
    );
}

QuestionBar.propTypes={
    data:PropTypes.array
};

export default QuestionBar;