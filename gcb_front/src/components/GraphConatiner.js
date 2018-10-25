import React, {
  Component
} from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';


import CytoscapeDagreGraph from './CytoscapeDagreGraph'

import { fetchGraph } from '../redux/actions/graphActions'
import { connect } from 'react-redux';


function removeAllTips(){
  console.log('remove tips')
  var elements = document.getElementsByClassName('tippy-popper');
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
}

class GraphContainer extends Component {

  state = {
    window: '5',
    tails: '5',
    depth: '30',
    freq_min: '2',
    layout: 'graphviz',
    loading: false
  }

  componentDidUpdate() {
    removeAllTips()
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleLayout = event => {
    removeAllTips()
    this.setState({ layout: event.target.value });
  };

  getGraphParams() {
    // Get selector data from redux store
    let sel = this.props.selection

    // Get data from current component 
    let graph_params = {
      org: sel.org,
      stamm: sel.stamm,
      contig: sel.contig,
      og_start: sel.og_start,
      og_end: sel.og_end,
      window: this.state.window,
      tails: this.state.tails,
      pars_int: sel.pars_int.toString(),
      operons_int: sel.operons_int.toString(),
      depth: this.state.depth,
      freq_min: this.state.freq_min
    }

    return graph_params
  }

  handleGraphDraw = () => {
    // Make redux request
    let params = this.getGraphParams()
    //console.log(params)
    this.props.fetchGraph(params)
    this.setState({ loading: true })
  }

  componentDidUpdate(prevProps, prevState) {
    
    if (this.props.graph.result === 'SUCCESS' && this.state.loading === true) {
      if(JSON.stringify(this.props.graph.params) === JSON.stringify(this.getGraphParams()))
        this.setState({ loading: false })
    }
  }


  render() {
    let what_to_show = null
    if (this.state.loading) {
      what_to_show =
        <div style={{ display: 'flex', height: 800, width: '100%' }}>
          <CircularProgress style={{ margin: 'auto' }}
            //className={classes.progress} 
            size={300} />
        </div>
    }
    else {
      if (this.props.graph.result === 'NOT LOADED') {
        what_to_show =
          <div style={{ display: 'flex', height: 800, width: '100%' }}>
            <Typography variant="h2" style={{ margin: 'auto', textAlign: 'center' }} > Please, select parameters and click DRAW button</Typography>
          </div>
      }
      else {

        what_to_show = < CytoscapeDagreGraph data={this.props.graph.data} layout={this.state.layout} />
      }
    }

    // console.log(what_to_show)
    return (
      <div>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item style={{ marginTop: 16, marginLeft: 16 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Layouter</FormLabel>
              <RadioGroup
                aria-label="layouter"
                name="layouter"

                value={this.state.layout}
                onChange={this.handleLayout}
                style={{ display: 'inline' }}
              >
                <FormControlLabel value="dagre" control={<Radio />} label="Dagre" />
                <FormControlLabel value="graphviz" control={<Radio />} label="Graphviz" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item style={{ maxWidth: 100, margin: 12 }}>
            <TextField type="number" margin="normal" label={'Tails'} name='tails' value={this.state.tails} onChange={this.handleChange} />
          </Grid>

          <Grid item style={{ maxWidth: 100, margin: 12 }}>
            <TextField type="number" margin="normal" label={'Depth'} name='depth' value={this.state.depth} onChange={this.handleChange} />
          </Grid>

          <Grid item style={{ maxWidth: 150, margin: 12 }}>
            <TextField type="number" margin="normal" label={'Minimal edge'} name='freq_min' value={this.state.freq_min} onChange={this.handleChange} />
          </Grid>

          <Grid item style={{ maxWidth: 100, margin: 12 }}>
            <TextField type="number" margin="normal" label={'Window'} name='window' value={this.state.window} onChange={this.handleChange} />
          </Grid>

          <Grid item >
            <Button variant="contained" color="primary" onClick={this.handleGraphDraw} style={{ margin: 12 }}>Draw</Button>
          </Grid>
        </Grid>

        {what_to_show}

      </div>
    )
  }
}

const mapStateToProps = state => ({
  graph: state.graph.graph,
  selection: state.reference.selection
});

export default connect(mapStateToProps, { fetchGraph })(GraphContainer)