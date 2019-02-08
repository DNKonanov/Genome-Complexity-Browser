import React, {
  Component
} from 'react';
import Plot from 'react-plotly.js';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {
  SERVER_URL,
  SERVER_PORT
} from "../redux/constants/urls";
import { fetchOrganisms, fetchStammsForOrg, fetchContigs, fetchComplexity, putSelectedRef, fetchWindows } from '../redux/actions/referenceActions'
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import { Paper} from '@material-ui/core';


function removeAllTips(){
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
  paper: {
    height: 300,
    overflow: 'auto'

  }
});

class Selector extends Component {

  state = {
    org: 'Escherichia_coli',
    stamm: 'GCF_000007445.1_ASM744v1',
    genome_name : '',
    contig: 'NC_004431.1',

    og_start: 'OG0001707',
    og_end: 'OG0001707',
    coord_start: 0,
    coord_end: 0,

    pars: false,
    operons: true,
    
    methods: [
    'window complexity', 
    'probabilistic window complexity',
    'IO complexity', 
    'probabilistic IO complexity',
  ],
    method: 'window complexity',
    user_coordinates_str: '',
    user_coordinates: [],
    user_values: [],
    draw_types: ['line', 'markers'],
    draw_type: 'line',
    data: '',
    src: '',
    complexity_window: 20,
    search_query: '',
    search_results: [],
    max_user_value: 1
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
          this.setState({ stamm: this.props.stamms.list[0]})
          this.setState({ genome_name: this.props.stamms.names[0]})
        }
        else { //selected stamm is from current list
          if (this.props.contigs.stamm !== this.state.stamm) { //contigs for stamm not loaded
            this.props.fetchContigs(this.state.org, this.state.stamm);
            return;
          }
          else { //selected stamm is from current list
            if (this.props.complexity_windows.stamm !== this.state.stamm) { //contigs for stamm not loaded
              this.props.fetchWindows(this.state.org, this.state.stamm);
              return;
            }

            else {//contigs loaded
              if (!this.isInArray(this.props.contigs.list, this.state.contig)) { //selected stamm is not from list
                this.setState({ contig: this.props.contigs.list[0] })
              }
              else {
                let comp_par = this.props.complexity.request;
                this.props.putSelectedRef(this.state.org, this.state.stamm, this.state.contig, 
                  this.state.og_start, this.state.og_end, this.state.method, this.state.pars, this.state.operons, this.state.complexity_window

                )
                if (comp_par.org !== this.state.org || comp_par.stamm !== this.state.stamm ||
                  comp_par.contig !== this.state.contig || comp_par.method !== this.state.method ||
                  comp_par.pars !== this.state.pars || comp_par.complexity_window !== this.state.complexity_window) {
                  
                  this.props.fetchComplexity(this.state.org, this.state.stamm, this.state.contig, this.state.method, this.state.pars, this.state.complexity_window)

                  
                  }

                else {
                  if (this.props.og_start !== this.state.og_start || this.props.og_end !== this.state.og_end) {
                    this.props.putSelectedRef(this.state.org, this.state.stamm, this.state.contig, 
                      this.state.og_start, this.state.og_end, this.state.method, this.state.pars, this.state.operons, this.state.complexity_window);

                  }
                  else {
                    
                    if (prevState.coord_start !== this.state.coord_start || prevState.coord_end !== this.state.coord_end ) {

                      

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
                      
                      if (this.props.complexity.OGs[close_st_gene] !== undefined && this.props.complexity.OGs[close_end_gene] !== undefined) {
                        this.setState({
                          og_end: this.props.complexity.OGs[close_end_gene],
                          og_start: this.props.complexity.OGs[close_st_gene]
                        })
                        this.props.putSelectedRef(this.state.org, this.state.stamm, this.state.contig, 
                        this.props.complexity.OGs[close_st_gene], this.props.complexity.OGs[close_end_gene], this.state.method, this.state.pars, this.state.operons, this.state.complexity_window)

                      
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  checkOGs = (event) => {
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
    
    if (this.props.complexity.OGs[close_st_gene] !== undefined && this.props.complexity.OGs[close_end_gene] !== undefined) {
      this.setState({
        og_end: this.props.complexity.OGs[close_end_gene],
        og_start: this.props.complexity.OGs[close_st_gene]
      })
    }
  }

  checkCoord = (event) => {
    let coord_start = -1
    let coord_end = -1

    for (let i = 0; i < this.props.complexity.OGs.length; i++) {
      if (this.props.complexity.OGs[i] === this.state.og_start) {
        coord_start = this.props.complexity.coord_list[i]
      }
      if (this.props.complexity.OGs[i] === this.state.og_end) {
        coord_end = this.props.complexity.coord_list[i]
      }
    }

    if (coord_start === -1) {
      alert('Start OG is not in chosed genome!')
    }

    else if (coord_end === -1) {
      alert('Eng OG is not in chosed genome!')
    }

    if (coord_start !== -1 && coord_end !== -1) {
      this.setState({
        coord_start: coord_start,
        coord_end: coord_end
      })
    }
    
  }

  handleSubmit = (event) => {
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

      let max_coord = -1000000000

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].split(':');
        coord.push(parseInt(line[0], 10));
        
        let v = parseFloat(line[1])
        if (v > max_coord) { max_coord = v}
        values.push(-v)
      }

      this.setState({
        user_coordinates: coord,
        user_values: values,
        max_user_value: max_coord
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

  downloadData = (e) => {


    let data = 'organism=' + this.state.org + '\tgenome=' + this.state.stamm + '\tcontig=' + this.state.contig + '\tmethod=' + this.state.method + '\n'
    data = data + 'position\tcomplexity\n'
    for (let i = 0; i < this.props.complexity.coord_list.length; i++) {
      data = data + this.props.complexity.coord_list[i] + '\t' + this.props.complexity.complexity[i] + '\n'
    }

    var element = document.createElement("a");
    var file = new Blob([data], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = this.state.contig + ".txt";
    element.click();
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

  search = (e) => {
    let url = SERVER_URL + SERVER_PORT + '/search/org/' + this.state.org + '/strain/' + this.state.stamm + '/pars/' + this.state.pars + '/input/' + this.state.search_query + '/'
    fetch(url)
      .then(response => response.json())
      .then(data => {this.setState({search_results: data})})
      .catch(error => console.log('error'));

    e.preventDefault()
  }

  clearSearchResults = (e) => {
    this.setState({
      search_results: []
    }
    )
  }



  render() {
    const { classes } = this.props;
    const data = this.props.complexity


    let search_field = this.state.search_results.length === 0 ? <Typography>There are not results to show</Typography> :
      
      <Paper className={classes.paper} style={{margin:12}}>
      <Table>

        <TableHead>
            <TableRow>
                <TableCell>OG</TableCell>
                <TableCell>Gene description</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Contig</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {this.state.search_results.map(
                result => {
                    return (
                        <TableRow key={result[0]}>
                            <TableCell>{result[0]}</TableCell>
                            <TableCell>{result[1]}</TableCell>
                            <TableCell>

                              <button
                              value={result[2]} 
                              onClick={(e) => {
                                this.setState({
                                coord_start: e.target.value,
                                coord_end: e.target.value
                              })
                              }}
                              >
                              {result[2]}
                              </button>
                            
                            </TableCell>
                            <TableCell>{result[3]}</TableCell>
                        </TableRow>
                      )
                  }
              )}
        </TableBody>
        </Table>  
      </Paper>
      
      

    return (
      <div className={classes.root}>
         <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>ABOUT</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>

            <Grid container direction='column'>


              <Typography>User manual(alpha):<br />
                <a>PDF</a> <br/>
                <a>HTML</a>
              </Typography>

              <Typography>Link to github:<br/>
                <a href='https://github.com/DNKonanov/Genome-Complexity-Browser'>GitHub</a>
              </Typography>

              <Typography>Command-line tool:<br/>
                <a href='https://github.com/DNKonanov/geneGraph'>geneGraph</a>
              </Typography>

              <Typography>Stand-alone version of this service:<br/>
                <a href='https://github.com/DNKonanov/geneGraph'>GCB_package</a>
              </Typography>

            </Grid>


            
            

          </ExpansionPanelDetails>
        </ExpansionPanel>
        

        <ExpansionPanel defaultExpanded={true}>
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
                        {this.props.stamms.list.map(stamm => <MenuItem key={stamm} value={stamm}> {stamm + ' (' + this.props.stamms.names[this.props.stamms.list.indexOf(stamm)] + ')'} </MenuItem>)}
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

                  <Grid container direction="row" justify="flex-start" alignItems="flex-start">

                    <Grid item xs={6}>
                      <TextField label={'Start OG'} name='og_start' value={this.state.og_start} onChange={this.handleChange} />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField label={'End OG'} name='og_end' value={this.state.og_end} onChange={this.handleChange} />
                      <Button style={{margin:12}} color='primary' variant='contained' onClick={(e) => {this.checkOGs(e)}}>Update genes</Button>
                    </Grid>
                  </Grid>

                  <Grid container direction="row" justify="flex-start" alignItems="flex-start">

                    <Grid item xs={6}>
                      <TextField label={'Start coordinate'} name='coord_start' value={this.state.coord_start} onChange={this.handleChange} />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField label={'End coordinate'} name='coord_end' value={this.state.coord_end} onChange={this.handleChange} />
                      <Button style={{margin:12}} color='primary' variant='contained' onClick={(e) => {this.checkCoord(e)}}>Update coordinates</Button>
                    </Grid>

                  </Grid>

                  <Grid item>
                    <FormControlLabel
                      control={<Switch name='pars' value="checked" color="primary" checked={this.state.pars} onChange={this.checkPars} />}
                      label="Draw paralogous" />
                  </Grid>

                  <Grid item>
                    <FormControlLabel
                      control={<Switch name='pars' checked={this.state.operons} onChange={this.checkOperons} value="pars" color="primary" />}
                      label="Draw operons" />
                  </Grid>
                </Grid>
              </Grid>

            </Grid>

          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>SEARCH</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container direction='column'>
              <form onSubmit={this.search}>

                <Grid container direction="row" alignItems="flex-start" spacing={24}>
                  <Grid >
                    <TextField label={'Search'} name='search_query' value={this.state.search_query}  onChange={this.handleChange}/>
                  </Grid>

                  <Grid item>
                    <Button color='primary' variant='contained' type="submit" onClick={(e) => {this.search(e)}}>SEARCH</Button>
                  </Grid>
                
                  <Grid item>
                    <Button color='primary' variant='contained' onClick={(e) => {this.clearSearchResults(e)}}>CLEAR SEARCH RESULTS</Button>
                  </Grid>

                </Grid>
              </form>
                  
                

              <Grid item>
                {search_field}
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

                    <FormControl>
                      <InputLabel htmlFor="complexity_window">Window</InputLabel>
                      <Select value={this.state.complexity_window} name='complexity_window' onChange={this.handleChange}>
                        {this.props.complexity_windows.list.map(complexity_window => <MenuItem key={complexity_window} value={complexity_window}> {complexity_window} </MenuItem>)}
                      </Select>
                    </FormControl>
                    </Grid>

                    <Grid item>

                      <Button
                        style={{ margin: 6 }}
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

                      <Button 
                        style={{ margin: 6 }}
                        variant="contained" 
                        color="primary"
                        component="label"
                        onClick={(e) => { this.drawUserCoordinates(e) }}
                      >
                        Show user coordinates
                      </Button>
                    </Grid>
                    <Grid item>

                      <Button 
                        style={{ margin: 6 }}
                        variant="contained" 
                        color="primary"
                        component="label"
                        onClick={(e) => { this.deleteUserCoordinates(e) }}
                      >
                        Delete user coordinates
                      </Button>
                    </Grid>
                    
                    <Grid item>

                      <Select style={{ margin: 6 }} value={this.state.draw_type} name='draw_types' onChange={e => this.setState({ draw_type: e.target.value })}>
                        {this.state.draw_types.map(draw_type => <MenuItem key={draw_type} value={draw_type}>{draw_type}</MenuItem>)}
                      </Select>
                      
                    </Grid>

                    <Grid item>
                    {this.state.user_coordinates_str.length === 0 ? <Typography style={{margin:6}}>User coordinates are not loaded</Typography> : <Typography style={{margin:6}}> Coordinates was loaded succesfully</Typography>}
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
                          range:[-data.max_complexity, data.max_complexity],
                          title: 'complexity',
                          overlaying: 'y2'
                        },

                        yaxis2: {
                          range: [-this.state.max_user_value, this.state.max_user_value],
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
                <Grid item>
                  <Button 
                    style={{ margin: 6 }}
                    variant="contained" 
                    color="primary"
                    component="label"
                    onClick={(e) => { this.downloadData(e) }}
                  >
                    Download data
                  </Button>

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
  complexity_windows: state.reference.complexity_windows,
  contigs: state.reference.contigs,
  complexity: state.reference.complexity,
  og_start: state.reference.selection.og_start,
  og_end: state.reference.selection.og_end
});

export default connect(mapStateToProps, { fetchOrganisms, fetchStammsForOrg, fetchContigs, fetchComplexity, putSelectedRef, fetchWindows })(withStyles(styles)(Selector));
