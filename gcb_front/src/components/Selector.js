import React, {
  Component
} from 'react';
import './Selector.css';
import Plot from 'react-plotly.js';
import * as math from 'mathjs';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  root: {
    flexWrap: 'wrap',
  },
  grow: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    minHeight: 300
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Selector extends Component {

  constructor(props) {

    super(props)
    this.state = {
      org: 'Achromobacter_xylosoxidans',
      stamm: 'GCF_000165835.1_ASM16583v1_genomic',
      contig: 'NC_014640.1',
      organisms: [],
      stamms: [],
      contigs: [],
      complexity: [],
      max_complexity: 0,
      OGs: [],
      og_start: 'OG0001707',
      og_end: 'OG0001707',
      coord_start: 0,
      coord_end: 0,
      coord_list: [],
      length_list: [],
      window: '5',
      tails: '5',
      depth: '30',
      freq_min: '2',
      pars: false,
      operons: true,
      methods: ['window complexity (w20)', 'probabilistic window complexity (w20)', 'IO complexity', 'probabilistic IO complexity'],
      method: 'window complexity (w20)',
      user_coordinates_str: '',
      user_coordinates: [],
      user_values: [],
      draw_types: ['line', 'markers'],
      draw_type: 'line plot',
      data: '',
      src: '',
    };
  }

  prev_state = {}


  componentDidUpdate(prev_state) {
    if (this.prev_state.org !== this.state.org) {
      let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/'
      fetch(link)
        .then(response => response.json())
        .then(data => {
          this.setState({
            stamms: data,
            stamm: data[0]
          });
        });
    }

    if (this.prev_state.stamm !== this.state.stamm) {
      let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/'
      fetch(link)
        .then(response => response.json())
        .then(data => {
          this.setState({
            contigs: data,
            contig: data[0]
          });
        });



    }

    if (this.prev_state.contig !== this.state.contig) {

      let pars_int = 0
      if (this.state.pars === true) {
        pars_int = 1
      }

      let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/' + this.state.contig + '/methods/' + this.state.method + '/pars/' + pars_int + '/complexity/'
      fetch(link)
        .then(response => response.json())
        .then(data => {
          this.setState({
            complexity: data[0]
          });
          this.setState({
            max_complexity: math.max(this.state.complexity),
            length_list: data[3],
            OGs: data[1],
            coord_list: data[2]
          })
        });

    }

    if (this.prev_state.method !== this.state.method) {
      let pars_int = 0
      if (this.state.pars === true) {
        pars_int = 1
      }

      let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/' + this.state.contig + '/methods/' + this.state.method + '/pars/' + pars_int + '/complexity/'
      fetch(link)
        .then(response => response.json())
        .then(data => {
          this.setState({
            complexity: data[0]
          });
          this.setState({
            max_complexity: math.max(this.state.complexity),
            length_list: data[3],
            OGs: data[1],
            coord_list: data[2]
          })
        });

    }

    if (this.prev_state.pars !== this.state.pars) {
      let pars_int = 0
      if (this.state.pars === true) {
        pars_int = 1
      }


      let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/' + this.state.contig + '/methods/' + this.state.method + '/pars/' + pars_int + '/complexity/'
      fetch(link)
        .then(response => response.json())
        .then(data => {
          this.setState({
            complexity: data[0]
          });
          this.setState({
            max_complexity: math.max(this.state.complexity),
            length_list: data[3],
            OGs: data[1],
            coord_list: data[2]
          })
        });

    }


    if (this.prev_state.coord_start !== this.state.coord_start || this.prev_state.coord_end !== this.state.coord_end) {

      let close_st_gene = 0
      let close_end_gene = 0
      let close_st_len = Math.abs(this.state.coord_list[0] - this.state.coord_start)
      let close_end_len = Math.abs(this.state.coord_list[0] - this.state.coord_start)

      for (let i = 0; i < this.state.coord_list.length; i++) {
        let len = Math.abs(this.state.coord_list[i] - this.state.coord_start);
        if (len < close_st_len) {
          close_st_gene = i;
          close_st_len = len
        }
        len = Math.abs(this.state.coord_list[i] - this.state.coord_end);
        if (len < close_end_len) {
          close_end_gene = i;
          close_end_len = len
        }

      }


      if (this.state.OGs[close_st_gene] !== undefined && this.state.OGs[close_end_gene] !== undefined) {
        this.setState({
          og_end: this.state.OGs[close_end_gene],
          og_start: this.state.OGs[close_st_gene]
        })
      }
    }
    this.prev_state = this.state
  }


  componentDidMount() {
    fetch('http://10.210.29.150:5000/org/')
      .then(response => response.json())
      .then(data => {
        this.setState({
          organisms: data.sort(),
          org: data[0]
        })
      });

    let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/'
    fetch(link)
      .then(response => response.json())
      .then(data => {
        this.setState({
          stamms: data,
          stamm: data[0]
        })
      });

    link = link + this.state.stamm + '/contigs/'
    fetch(link)
      .then(response => response.json())
      .then(data => {
        this.setState({
          contigs: data,
          contig: data[0]
        })
      });

    link = link + this.state.contig + '/methods/' + this.state.method + '/pars/0/complexity/'
    fetch(link)
      .then(response => response.json())
      .then(data => { this.setState({ complexity: data[0] }); this.setState({ OGs: data[1] }); });


  }

  handleSubmit = (event) => {

    this.props.getDataFromSelector(this.state)
    event.preventDefault();
  }


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


  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  checkPars = (event) => {

    this.setState({ pars: event.target.checked });
  }

  checkOperons = (event) => {
    this.setState({ operons: event.target.checked });
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
    const { classes } = this.props;


    return (
      <div>
        <Paper className={classes.grow}>
          {/* <form  onSubmit={this.handleSubmit} style={{ margin: 12 }}> */}
          <FormControl>
            <InputLabel htmlFor="org">Organism</InputLabel>
            <Select
              value={this.state.org}
              name='org'
              input={<Input name="org" id="org" />}
              onChange={this.handleChange}>
              {this.state.organisms.map(org =>
                <MenuItem key={org} value={org}>{org}</MenuItem>
              )}
            </Select>
          </FormControl>

          <InputLabel htmlFor="stamm">Reference</InputLabel>
          <Select
            className="input"
            value={this.state.stamm}
            name='stamm'
            onChange={this.handleChange}>
            {this.state.stamms.map(stamm =>
              <MenuItem key={stamm} value={stamm}>
                {stamm}
              </MenuItem>
            )}
          </Select>

        </Paper>

        <label>
          Contig:
            <select
            className="input"
            value={this.state.contig}
            name='contig'
            onChange={this.handleChange}>
            {this.state.contigs.map(contig =>
              <option key={contig} value={contig}>
                {contig}
              </option>
            )}
          </select>
        </label><br />
        <label>
          method:
            <select
            className="input"
            value={this.state.method}
            name='method'
            onChange={this.handleChange}>
            {this.state.methods.map(method =>
              <option key={method} value={method}>
                {method}
              </option>)}
          </select>
        </label><br />

        <label>
          OG start:
            <input className="input" type="text" name='og_start' value={this.state.og_start} onChange={this.handleChange} />
        </label><br />

        <label>
          OG end:
            <input className="input" type="text" name='og_end' value={this.state.og_end} onChange={this.handleChange} />
        </label><br />

        <label>
          Coordinate start:
            <input className="input" type="text" name='coord_start' value={this.state.coord_start} onChange={this.handleChange} />
        </label><br />
        <label>
          Coordinate end:
            <input className="input" type="text" name='coord_end' value={this.state.coord_end} onChange={this.handleChange} />
        </label><br />
        <label>
          Tails:
            <input className="input" type="text" name='tails' value={this.state.tails} onChange={this.handleChange} />
        </label><br />
        <label>
          Depth:
            <input className="input" type="text" name='depth' value={this.state.depth} onChange={this.handleChange} />
        </label><br />
        <label>
          Minimal edge:
            <input className="input" type="text" name='freq_min' value={this.state.freq_min} onChange={this.handleChange} />
        </label><br />
        <label>
          Draw paralogous:
            <input type="checkbox" name='pars' checked={this.state.pars} onChange={this.checkPars} />
        </label><br />
        <label>
          Draw operons:
            <input type="checkbox" name='operons' checked={this.state.operons} onChange={this.checkOperons} />
        </label><br />
        <label>
          Window:
            <input className="input" type="text" name='window' value={this.state.window} onChange={this.handleChange} />
        </label><br />
        <input type="submit" value="Draw" />
        {/* </form> */}


        <form className="inputField">
          <p>
            <b>Input values</b> (format is "coord1:value1,coord2:value2, ... ". Spaces, tabs and EOLs are allowed)
            </p>
          <textarea
            cols="100"
            rows="2"
            style={{ width: 400 }}
            name='user_coordinates'
            onChange={e => this.setState({ user_coordinates_str: e.target.value })}
            value={this.state.user_coordinates_str} />
          <br />
          <input style={{ margin: 12 }} type="submit" value='Show user values' onClick={(e) => { this.drawUserCoordinates(e) }} />

          <label>
            <input type="file" ref="input_reader" onChange={this.inputFileChanged} />
          </label>

          <label>
            <select style={{ margin: 12 }} value={this.state.draw_type} name='draw_types' onChange={e => this.setState({ draw_type: e.target.value })}>
              {this.state.draw_types.map(draw_type => <option key={draw_type} value={draw_type}>{draw_type}</option>)}
            </select>
          </label>
        </form>


        {/* <Plot
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
        /> */}

      </div>


    )
  }

}

export default withStyles(styles)(Selector)