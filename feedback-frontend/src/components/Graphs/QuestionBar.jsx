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
const QuestionBar = ({ personal}) => {

    var personaldata = [];
    
    for (var i=0; i<personal.length; i++) {
        personaldata.push({
            "vraag": "Sessie "+(i+1),
            "Plan van aanpak": personal[i][0],
            "Concepten": personal[i][1],
            "Wiskundig model": personal[i][2],
            "Rekentechnisch": personal[i][3],
            "Interpretatie": personal[i][4],
        })
    }

    return (
    <ResponsiveBar
        data={personaldata}
        keys={[ 'Plan van aanpak', 'Concepten', 'Wiskundig model', 'Rekentechnisch','Interpretatie']}
        indexBy="vraag"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.25}
        groupMode="grouped"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        minValue={0}
        maxValue={1}
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
            legend: 'Aantal score',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        enableLabel={false}
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
