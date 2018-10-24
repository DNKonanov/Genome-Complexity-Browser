import React, {
  Component
} from 'react';
import Plot from 'react-plotly.js';
import * as math from 'mathjs';


import { connect } from 'react-redux';
import { fetchComplexity } from '../redux/actions/referenceActions'

import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';


class ComplexityChart extends Component {

  
  render() {
    console.log(this.props.complexity)

    const data = this.props.complexity
    return (
      <div>
        {data.complexity === 'None' ?
          <LinearProgress />
          :
          <Plot
            data={[
              {
                x: data.coord_list,
                y: data.complexity,
                text: data.OGs,
                type: 'line',
                name: 'complexity'
              },

              {
                x: [data.coord_start, data.coord_start],
                y: [-data.max_complexity / 2, data.max_complexity],
                mode: 'lines',
                name: 'left edge'
              },
              {
                x: [data.coord_end, data.coord_end],
                y: [-data.max_complexity / 2, data.max_complexity],
                mode: 'lines',
                name: 'rigth edge'
              },

               {
                 x: this.state.user_coordinates,
                 y: this.state.user_values,
                 mode: this.state.draw_type,
                 name: 'user values',
                 opacity: 0.5,
                 yaxis: 'y2',
                 marker: {
                   size: 5,
                 },
               }


            ]}
            layout={
              {
                width: 1000,
                height: 400,
                title: 'Genome complexity, ' + data.request.org + ', contig ' + data.request.contig + ', ' + data.request.method,

                xaxis: {
                  title: 'Chromosome position, bp',
                },

                yaxis: {
                  title: 'complexity',
                  overlaying: 'y2'
                },

                yaxis2: {
                  title: 'user values',
                  side: 'right'
                }
              }
            }
            onClick={(data) => {
              this.setState({
                og_start: data.points[0].text,
                og_end: data.points[0].text,
                coord_start: data.points[0].x,
                coord_end: data.points[0].x
              });
            }}
          />
        }



          
      </div>
    )
  }
}

const mapStateToProps = state => ({
  complexity: state.reference.complexity
});


export default connect(mapStateToProps, { fetchComplexity })(ComplexityChart)