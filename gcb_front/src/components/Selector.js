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
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import { SERVER_URL } from '../constants'



import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  root: {
    display: 'flex',
    width: '100%',
    minHeight: 150
  },
  smallText: {
    maxWidth: 150
  },
  grow: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    minHeight: 300,
    padding: 24,
    width: 420
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

  state = {
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

  prev_state = {}

  componentDidUpdate(prev_state) {
    if (this.prev_state.org !== this.state.org) {
      console.log('FETCHING NEW ORG')
      let link = SERVER_URL + '/org/' + this.state.org + '/stamms/'
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
      console.log('FETCHING NEW STAMM')

      let link = SERVER_URL + '/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/'
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
      console.log('FETCHING NEW CONTIG')

      let pars_int = 0
      if (this.state.pars === true) {
        pars_int = 1
      }
      let link = SERVER_URL + '/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/' + this.state.contig + '/methods/' + this.state.method + '/pars/' + pars_int + '/complexity/'
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

      console.log('FETCHING NEW METHOD')

      let link = SERVER_URL + '/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/' + this.state.contig + '/methods/' + this.state.method + '/pars/' + pars_int + '/complexity/'
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

      console.log('FETCHING NEW PARS')

      let link = SERVER_URL + '/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/' + this.state.contig + '/methods/' + this.state.method + '/pars/' + pars_int + '/complexity/'
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
    fetch(SERVER_URL + '/org/')
      .then(response => response.json())
      .then(data => {
        this.setState({
          organisms: data.sort(),
          org: data[0]
        })
      });

    let link = SERVER_URL + '/org/' + this.state.org + '/stamms/'
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
    console.log('SUBMIT IN SELECTOR')
    this.props.getDataFromSelector(this.state)
    event.preventDefault();
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

  

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={24}>

          <Grid item xs={6} > 
            <Grid container direction="column" justify="space-between" alignItems="flex-start">

              <Grid><Typography variant='h6'>Refrerence parameters</Typography></Grid>

              <Grid item>
                <FormControl>
                  <InputLabel htmlFor="org">Organism</InputLabel>
                  <Select value={this.state.org} name='org' input={<Input name="org" id="org" />} onChange={this.handleChange}>
                    {this.state.organisms.map(org => <MenuItem key={org} value={org}>{org}</MenuItem>)}
                  </Select>
                </FormControl></Grid>

              <Grid item>
                <FormControl>
                  <InputLabel htmlFor="stamm">Reference</InputLabel>
                  <Select value={this.state.stamm} name='stamm' onChange={this.handleChange}>
                    {this.state.stamms.map(stamm => <MenuItem key={stamm} value={stamm}> {stamm} </MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item>
                <FormControl>
                  <InputLabel htmlFor="contig">Contig:</InputLabel>
                  <Select value={this.state.contig} name='contig' onChange={this.handleChange}>
                    {this.state.contigs.map(contig => <MenuItem key={contig} value={contig}> {contig} </MenuItem>)}
                  </Select>
                </FormControl></Grid>

              <Grid container direction="row" justify="flex-start" alignItems="flex-start">

                <Grid item xs={6}>
                  <TextField className={classes.smallText} label={'OG start'} name='og_start' value={this.state.og_start} onChange={this.handleChange} />
                </Grid>

                <Grid item xs={6}>
                  <TextField label={'OG end'} name='og_end' value={this.state.og_end} onChange={this.handleChange} />
                </Grid>
              </Grid>

              <Grid container direction="row" justify="flex-start" alignItems="flex-start">

                <Grid item xs={6}>
                  <TextField label={'Coordinate start'} name='coord_start' value={this.state.coord_start} onChange={this.handleChange} />
                </Grid>

                <Grid item xs={6}>
                  <TextField label={'Coordinate end'} name='coord_end' value={this.state.coord_end} onChange={this.handleChange} />
                </Grid>

              </Grid>

              <Grid item><Button variant="contained" color="primary" onClick={this.handleSubmit}>Draw</Button></Grid>
            </Grid>
          </Grid>

          <Grid item xs={6} >
            <Grid container direction="column" justify="space-between" alignItems="flex-start" >
              <Grid><Typography variant='h6' >Alogorithm parameters</Typography></Grid>

              <Grid item>
                <FormControl>
                  <InputLabel htmlFor="method">Method</InputLabel>
                  <Select value={this.state.method} name='method' onChange={this.handleChange}>
                    {this.state.methods.map(method => <MenuItem key={method} value={method}> {method} </MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              <Grid container direction="row" justify="flex-start" alignItems="flex-start">

                <Grid item>
                  <TextField label={'Tails'} name='tails' value={this.state.tails} onChange={this.handleChange} />
                </Grid>

                <Grid item>
                  <TextField label={'Depth'} name='depth' value={this.state.depth} onChange={this.handleChange} />
                </Grid>

              </Grid>


              <Grid container direction="row" justify="flex-start" alignItems="flex-start">

                <Grid item>
                  <TextField label={'Minimal edge'} name='freq_min' value={this.state.freq_min} onChange={this.handleChange} />
                </Grid>

                <Grid item>
                  <TextField label={'Window'} name='window' value={this.state.window} onChange={this.handleChange} />
                </Grid>

              </Grid>

              <Grid item>
                <FormControlLabel
                  control={<Switch name='pars' value="checkedB" color="primary" checked={this.state.pars} onChange={this.checkPars} />}
                  label="Draw paralogous" />
              </Grid>

              <Grid item>
                <FormControlLabel
                  control={<Switch name='pars' checked={this.state.operons} onChange={this.checkOperons} value="checkedB" color="primary" />}
                  label="Draw operons" />
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </div>
    )
  }

}

export default withStyles(styles)(Selector)