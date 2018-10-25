import React, {
  Component
} from 'react';
import Plot from 'react-plotly.js';
import * as math from 'mathjs';

import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import RaisedButton from '@material-ui/core/Button';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';


import { fetchOrganisms, fetchStammsForOrg, fetchContigs, fetchComplexity, putSelectedRef } from '../redux/actions/referenceActions'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';



import { withStyles } from '@material-ui/core/styles';


function removeAllTips(){
  console.log('remove tips')
  var elements = document.getElementsByClassName('tippy-popper');
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    width: '100%',
    minHeight: 150,
    flexDirection: 'column',
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

    og_start: 'OG0001707',
    og_end: 'OG0001707',
    coord_start: 0,
    coord_end: 0,

    pars: false,
    operons: true,
    
    methods: ['window complexity (w20)', 'probabilistic window complexity (w20)', 'IO complexity', 'probabilistic IO complexity'],
    method: 'window complexity (w20)',
    user_coordinates_str: '',
    user_coordinates: [],
    user_values: [],
    draw_types: ['line', 'markers'],
    draw_type: 'line',
    data: '',
    src: '',
  };


  componentDidMount() {
    this.props.fetchOrganisms();
  }

  isInArray = (array, element) => {
    for (let i = 0; i < array.length; i++) {
      if (element === array[i]) {
        return true;
      }
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    removeAllTips()
    if (this.props.organisms.length > 0) {// This means we succesfully loaded list of organisms
      if (this.props.stamms.org !== this.state.org) { //Stamms for selected organims are not loaded
        this.props.fetchStammsForOrg(this.state.org);
        return;
      }
      else { // stamms loaded
        if (!this.isInArray(this.props.stamms.list, this.state.stamm)) { //selected stamm is not from list
          this.setState({ stamm: this.props.stamms.list[0] })
        }
        else { //selected stamm is from current list
          if (this.props.contigs.stamm !== this.state.stamm) { //contigs for stamm not loaded
            this.props.fetchContigs(this.state.org, this.state.stamm);
            return;
          }
          else {//contigs loaded
            if (!this.isInArray(this.props.contigs.list, this.state.contig)) { //selected stamm is not from list
              this.setState({ contig: this.props.contigs.list[0] })
            }
            else {
              let comp_par = this.props.complexity.request;

              let p = comp_par.pars
              if (comp_par.org !== this.state.org || comp_par.stamm !== this.state.stamm ||
                comp_par.contig !== this.state.contig || comp_par.method !== this.state.method ||
                comp_par.pars !== this.state.pars) {
                this.props.fetchComplexity(this.state.org, this.state.stamm, this.state.contig, this.state.method, this.state.pars)
                this.props.putSelectedRef(this.state.org, this.state.stamm, this.state.contig, 
                  this.state.og_start, this.state.og_end, this.state.method, this.state.pars, this.state.operons

                )
                console.log('ALL SET OUT')
              }

              else {
                if (prevState.coord_start !== this.state.coord_start || prevState.coord_end !== this.state.coord_end || p !== this.state.pars) {
                  let close_st_gene = 0
                  let close_end_gene = 0
                  let close_st_len = Math.abs(this.props.complexity.coord_list[0] - this.state.coord_start)
                  let close_end_len = Math.abs(this.props.complexity.coord_list[0] - this.state.coord_start)
                  for (let i = 0; i < this.props.complexity.coord_list.length; i++) {
                    let len = Math.abs(this.props.complexity.coord_list[i] - this.state.coord_start);
                    if (len < close_st_len) {
                      close_st_gene = i;
                      close_st_len = len
                    }


                    len = Math.abs(this.props.complexity.coord_list[i] - this.state.coord_end);
                    if (len < close_end_len) {
                      close_end_gene = i;
                      close_end_len = len
                    }    
                  }
                  console.log('ALL SET OUT')
                  
                  if (this.props.complexity.OGs[close_st_gene] !== undefined && this.props.complexity.OGs[close_end_gene] !== undefined) {
                    this.setState({
                      og_end: this.props.complexity.OGs[close_end_gene],
                      og_start: this.props.complexity.OGs[close_st_gene]
                    })
                    this.props.putSelectedRef(this.state.org, this.state.stamm, this.state.contig, 
                    this.props.complexity.OGs[close_st_gene], this.props.complexity.OGs[close_end_gene], this.state.method, this.state.pars, this.state.operons
    
                    )
                  }
                  
                }
              }
            }
          }
        }
      }
    }


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


  deleteUserCoordinates = (e) => {

    this.setState({
      user_coordinates: [],
      user_coordinates_str: ''
    })
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

    e.preventDefault()
  }


  render() {
    const { classes } = this.props;
    const data = this.props.complexity
    return (
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>SELECT PARAMETERS</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={24}>
              <Grid item xs={6} >
                <Grid container direction="column" justify="space-between" alignItems="flex-start">

                  <Grid><Typography variant='h6'>Reference parameters</Typography></Grid>

                  <Grid item>
                    <FormControl>
                      <InputLabel htmlFor="org">Organism</InputLabel>
                      <Select value={this.state.org} name='org' input={<Input name="org" id="org" />} onChange={this.handleChange}>
                        {this.props.organisms.map(org => <MenuItem key={org} value={org}>{org}</MenuItem>)}
                      </Select>
                    </FormControl></Grid>

                  <Grid item>
                    <FormControl>
                      <InputLabel htmlFor="stamm">Reference</InputLabel>
                      <Select value={this.state.stamm} name='stamm' onChange={this.handleChange}>
                        {this.props.stamms.list.map(stamm => <MenuItem key={stamm} value={stamm}> {stamm} </MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item>
                    <FormControl>
                      <InputLabel htmlFor="contig">Contig:</InputLabel>
                      <Select value={this.state.contig} name='contig' onChange={this.handleChange}>
                        {this.props.contigs.list.map(contig => <MenuItem key={contig} value={contig}> {contig} </MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6} >
                <Grid container direction="column" justify="space-between" alignItems="flex-start" >
                  {/* <Grid><Typography variant='h6' >Algorithm parameters</Typography></Grid> */}

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

          </ExpansionPanelDetails>
        </ExpansionPanel>

        {data.complexity === 'None' ?
          <LinearProgress />
          :
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>COMPLEXITY PLOT</Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Grid container direction="column" justify="flex-start" alignItems="stretch">
                <Grid item >
                  <Grid container direction="row" justify="flex-start" alignItems="flex-start" style={{ width: '100%' }}>
                    <Grid item>

                      <FormControl>
                        <InputLabel htmlFor="method">Method</InputLabel>
                        <Select value={this.state.method} name='method' onChange={this.handleChange}>
                          {this.state.methods.map(method => <MenuItem key={method} value={method}> {method} </MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item>

                      <Button 
                        style={{ margin: 12 }}
                        variant="contained" 
                        color="primary"
                        component="label"
                      >
                        Show user coordinates
                        <input
                          onClick={(e) => { this.drawUserCoordinates(e) }}
                          style={{ display: 'none' }}
                          type="submit"
                        />
                      </Button>
                    </Grid>
                    <Grid item>

                      <Button 
                        style={{ margin: 12 }}
                        variant="contained" 
                        color="primary"
                        component="label"
                      >
                        Delete user coordinates
                        <input
                          onClick={(e) => { this.deleteUserCoordinates(e) }}
                          style={{ display: 'none' }}
                          type="submit"
                        />
                      </Button>
                    </Grid>
                    <Grid item>

                      <Button
                        style={{ margin: 12 }}
                        variant="contained" 
                        color="primary"
                        component="label"
                      >
                        Load file
                        <input
                          onChange={(e) => {this.inputFileChanged(e)}}
                          style={{ display: 'none' }}
                          type="file"
                        />
                      </Button>
                    </Grid>
                    <Grid item>

                      <Select style={{ margin: 12 }} value={this.state.draw_type} name='draw_types' onChange={e => this.setState({ draw_type: e.target.value })}>
                        {this.state.draw_types.map(draw_type => <MenuItem key={draw_type} value={draw_type}>{draw_type}</MenuItem>)}
                      </Select>
                      
                    </Grid>

                    <Grid item>
                    {this.state.user_coordinates_str.length === 0 ? <Typography>User coordinates are not loaded</Typography> : <Typography> Coordinates was loaded succesfully</Typography>}
                    </Grid>

                  </Grid>
                </Grid>

                <Grid item>
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
                        x: [this.state.coord_start, this.state.coord_start],
                        y: [-data.max_complexity / 2, data.max_complexity],
                        mode: 'lines',
                        name: 'left edge'
                      },
                      {
                        x: [this.state.coord_end, this.state.coord_end],
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
                        autosize: true,
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
                    useResizeHandler={true}
                    style={{ width: "100%", height: "400" }}
                    onClick={(data) => {
                      this.setState({
                        og_start: data.points[0].text,
                        og_end: data.points[0].text,
                        coord_start: data.points[0].x,
                        coord_end: data.points[0].x
                      });
                    }}
                  />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>

        }
      
      </div>
    )
  }

}

const mapStateToProps = state => ({
  organisms: state.reference.organisms,
  stamms: state.reference.stamms,
  contigs: state.reference.contigs,
  complexity: state.reference.complexity
});

export default connect(mapStateToProps, { fetchOrganisms, fetchStammsForOrg, fetchContigs, fetchComplexity, putSelectedRef })(withStyles(styles)(Selector));