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
          "vraag": "Oefenzitting 1",
          "Plan van aanpak": 122,
          "Concepten": 118,
          "Wiskundig model": 24,
          "Rekentechnisch": 139,
          "Interpretatie": 129
        },
        {
          "vraag": "Oefenzitting 2",
          "Plan van aanpak": 122,
          "Concepten": 118,
          "Wiskundig model": 24,
          "Rekentechnisch": 139,
          "Interpretatie": 129
        },
        {
          "vraag": "Oefenzitting 3",
          "Plan van aanpak": 122,
          "Concepten": 118,
          "Wiskundig model": 24,
          "Rekentechnisch": 139,
          "Interpretatie": 129
        },
        {
          "vraag": "Oefenzitting 4",
          "Plan van aanpak": 122,
          "Concepten": 118,
          "Wiskundig model": 24,
          "Rekentechnisch": 139,
          "Interpretatie": 129
        }
      ]
    return (
    <ResponsiveBar
        data={data}
        keys={[ 'Plan van aanpak', 'Concepten', 'Wiskundig model', 'Rekentechnisch','Interpretatie']}
        indexBy="vraag"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.25}
        groupMode="grouped"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{scheme:'nivo'}}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', '1' ] ] }}
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