import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import PropTypes from 'prop-types';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.



const CustomRadar = ({ personal, average /* see data tab */ }) => {
    const RadarData = [
        {
          "pijler": "Plan van aanpak",
          "average": average[0],
          "personal": personal[0],
        },
        {
          "pijler": "Concepten",
          "average": average[1],
          "personal": personal[1],
        },
        {
          "pijler": "Wiskundig model",
          "average": average[2],
          "personal": personal[2],
        },
        {
          "pijler": "Rekentechnisch",
          "average": average[3],
          "personal": personal[3],
        },
        {
          "pijler": "Interpretatie",
          "average": average[4],
          "personal": personal[4],
        }
      ]

    return (
        <ResponsiveRadar
        data={RadarData}
        keys={['average', 'personal']}
        indexBy="pijler"
        maxValue="auto"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: 'color' }}
        gridLevels={5}
        gridShape="circular"
        gridLabelOffset={36}
        enableDots={true}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        enableDotLabel={true}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={{ scheme: 'paired' }}
        fillOpacity={0.25}
        blendMode="multiply"
        animate={true}
        motionConfig="wobbly"
        isInteractive={true}
        legends={[
            {
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
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
        ]}
    />
    ); 
};

CustomRadar.propTypes= {
    data:PropTypes.array
};



export default CustomRadar;