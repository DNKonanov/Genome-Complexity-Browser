import React, {
  Component
} from 'react';
import Plot from 'react-plotly.js';
import * as math from 'mathjs';





class ComplexityChart extends Component {

  drawUserCoordinates = (e) => {
    if (this.state.user_coordinates_str.length !== 0) {
  
      let string = this.state.user_coordinates_str.replace(' ', '').replace('\t', '').replace('\n', '')
  
      let lines;
      lines = string.split(',');
      this.setState({ user_coordinates: [] })
      let coord = []
      let values = []
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].split(':');
        coord.push(parseInt(line[0], 10));
        values.push(parseFloat(line[1]))
      }
      this.setState({
        user_coordinates: coord,
        user_values: values
      })
  
    }
    e.preventDefault()
  }

  inputFileChanged = (e) => {

    if (window.FileReader) {
      let file = e.target.files[0], reader = new FileReader();
      reader.onload = function (r) {
        this.setState({
          user_coordinates_str: r.target.result
        });
      }.bind(this)
      reader.readAsText(file);
    }
    else {
      alert('Sorry, your browser does\'nt support for preview');
    }
  }
  
  render() {
    return (
      <div>
        <Plot
          data={[
            {
              x: this.state.coord_list,
              y: this.state.complexity,
              text: this.state.OGs,
              type: 'line',
              name: 'complexity'
            },

            {
              x: [this.state.coord_start, this.state.coord_start],
              y: [-this.state.max_complexity / 2, this.state.max_complexity],
              mode: 'lines',
              name: 'left edge'
            },
            {
              x: [this.state.coord_end, this.state.coord_end],
              y: [-this.state.max_complexity / 2, this.state.max_complexity],
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
              title: 'Genome complexity, ' + this.state.org + ', contig ' + this.state.contig + ', ' + this.state.method,

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


        {/* THIS STUFF GOES TO PLOT
          <Grid xs={3} container direction="column" justify="space-between" alignItems="flex-start" >

            <Typography> <b>Input values</b> (format is "coord1:value1,coord2:value2, ... ". </Typography>
            <Typography>Spaces, tabs and EOLs are allowed)</Typography>

            <TextField id="user_coordinates" label="Coordinates" multiline rowsMax="4"
              value={this.state.user_coordinates_str} 
              onChange={e => this.setState({ user_coordinates_str: e.target.value })}
              fullWidth margin="normal"
            />

            <input type="submit" value='Show user values' onClick={(e) => { this.drawUserCoordinates(e) }} />

            <label>
              <input type="file" ref="input_reader" onChange={this.inputFileChanged} />
            </label>

            <label>
              <select style={{ margin: 12 }} value={this.state.draw_type} name='draw_types' onChange={e => this.setState({ draw_type: e.target.value })}>
                {this.state.draw_types.map(draw_type => <option key={draw_type} value={draw_type}>{draw_type}</option>)}
              </select>
            </label>
          </Grid> */}

      </div>
    )
  }
}


export default ComplexityChart