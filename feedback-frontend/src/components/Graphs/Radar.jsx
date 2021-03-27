import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import PropTypes from 'prop-types';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.



const CustomRadar = ({ personal, average /* see data tab */ }) => {
    console.log(average);
    let avgPersonal = calculateAverage(personal);
    let avgAverage = calculateAverage(average);
    console.log(avgAverage);

    function calculateAverage(data){
      let amount = parseFloat(data.length);
      let tot=[0.0,0.0,0.0,0.0,0.0];
      for (const d in data){
        let data0 = parseFloat(data[d][0]);
        let data1 = parseFloat(data[d][1]);
        let data2 = parseFloat(data[d][2]);
        let data3 = parseFloat(data[d][3]);
        let data4 = parseFloat(data[d][4]);
        if (!(data0===0.0 && data1===0.0 && data2===0.0 && data3 === 0.0 && data4===0.0)){
          tot[0] += data0;
          tot[1] += data1;
          tot[2] += data2;
          tot[3] += data3;
          tot[4] += data4;
        } else {
          amount -= 1;
        }
      }
      console.log("after sum: "+tot);
      return tot.map( i => i/amount)
    }
    const RadarData = [
        {
          "pijler": "Plan van aanpak",
          "average": avgAverage[0],
          "personal": avgPersonal[0],
        },
        {
          "pijler": "Concepten",
          "average": avgAverage[1],
          "personal": avgPersonal[1],
        },
        {
          "pijler": "Wiskundig model",
          "average": avgAverage[2],
          "personal": avgPersonal[2],
        },
        {
          "pijler": "Rekentechnisch",
          "average": avgAverage[3],
          "personal": avgPersonal[3],
        },
        {
          "pijler": "Interpretatie",
          "average": avgAverage[4],
          "personal": avgPersonal[4],
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
        enableDotLabel={false}
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