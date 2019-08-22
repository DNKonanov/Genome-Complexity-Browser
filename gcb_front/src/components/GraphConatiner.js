import React, {
  Component
} from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import {putSelectedRef } from '../redux/actions/referenceActions';
import { fetchGraph } from '../redux/actions/graphActions'
import { connect } from 'react-redux';
import Switch from '@material-ui/core/Switch'


function removeAllTips(){
  var elements = document.getElementsByClassName('tippy-popper');
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
}

class GraphContainer extends Component {

  state = {
    window: 5,
    tails: 1,
    depth: 30,
    freq_min: 2,
    layout: 'graphviz',
    loading: false,
    step: 1,
    hide_edges: true,
  }


  handleChange = (event) => {

    if (event.target.name === 'depth') {
      if (event.target.value < 2) {return}
    }

    if ((event.target.name === 'freq_min') || (event.target.name === 'window')) {
      if (event.target.value < 1) {return}
    }

    if (event.target.name === 'tails') {
      if (event.target.value < 0) {return}
    }

    if (event.target.name === 'hide_edges') {
      console.log('---')
      console.log(event.target.checked)
      this.setState({
        hide_edges: event.target.checked,
      })
      
      console.log(this.state.hide_edges)
      return
    }

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
      hide_edges: this.state.hide_edges.toString(),
      pars_int: sel.pars_int.toString(),
      operons_int: sel.operons_int.toString(),
      depth: this.state.depth,
      freq_min: this.state.freq_min,
      layout: this.state.layout,
      complexity_window: sel.complexity_window
    }

    return graph_params
  }

  checkOG = () => {
    if (this.props.complexity.OGs.indexOf(this.props.selection.og_start) ===-1) {
      alert('Start OG is not in chosen genome')
      return true
    }
    
    if (this.props.complexity.OGs.indexOf(this.props.selection.og_end) ===-1) {
      alert('End OG is not in chosen genome')
      return true
    }
    return false

  }

  handleGraphDraw = () => {

    if (this.checkOG() === true) return


    // Make redux request
    let params = this.getGraphParams()
    //console.log(params)
    this.props.fetchGraph(params);

    console.log(this.props);
    this.setState({ loading: true })
  }

  componentDidUpdate(prevProps, prevState) {
    removeAllTips()
    if (this.props.graph.result === 'SUCCESS' && this.state.loading === true) {
      if(JSON.stringify(this.props.graph.params) === JSON.stringify(this.getGraphParams())) {
        this.setState({ loading: false })
      }  
    }
  }

  stepOfGraph = (e, direction) => {

    let sel = this.props.selection
    let n
    if (direction === 'right') n = parseInt(this.state.step, 10)
    else if (direction === 'left') n = -parseInt(this.state.step, 10)

    let newStartIndex = this.props.complexity.OGs.indexOf(sel.og_start) + n
    let newEndIndex = this.props.complexity.OGs.indexOf(sel.og_end) + n

    newStartIndex = newStartIndex >= 0 ? newStartIndex : 0
    newEndIndex = newEndIndex >= 0 ? newEndIndex : 0

    newStartIndex = newStartIndex < this.props.complexity.OGs.length ? newStartIndex : this.props.complexity.OGs.length - 1
    newEndIndex = newEndIndex < this.props.complexity.OGs.length ? newEndIndex : this.props.complexity.OGs.length - 1

    let start = this.props.complexity.OGs[newStartIndex]
    let end = this.props.complexity.OGs[newEndIndex]

    // Get data from current component 
    let params = {
      org: sel.org,
      stamm: sel.stamm,
      contig: sel.contig,
      og_start: start,
      og_end: end,
      window: this.state.window,
      hide_edges: this.state.hide_edges.toString(),
      tails: this.state.tails,
      pars_int: sel.pars_int.toString(),
      operons_int: sel.operons_int.toString(),
      depth: this.state.depth,
      freq_min: this.state.freq_min,
      layout: this.state.layout,
      complexity_window: sel.complexity_window
    }


    this.setState({ loading: true })
    this.props.putSelectedRef(sel.org, sel.stamm, sel.contig, start, end, sel.method, sel.pars, sel.operons, sel.complexity_window)
    this.props.fetchGraph(params)
  }

  render() {
    let show_load
    if (this.state.loading) {
      show_load =
          <CircularProgress style={{ margin: 'auto' }}
          //className={classes.progress} 
          size={40} />
    }
    else {
      show_load = <CircularProgress style={{ margin: 'auto' }} 
      variant='static'
      size={40} />
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
            <FormControlLabel
              control={<Switch name='hide_edges' value="checked" color="primary" checked={this.state.hide_edges} onChange={e => this.handleChange(e)} />}
              label="Hide reversed" />
            
          </Grid>

          <Grid item style={{ maxWidth: 100, margin: 12 }}>
            <TextField type="number" margin="normal" label={'Tails'} name='tails' value={this.state.tails} onChange={this.handleChange} />
          </Grid>

          <Grid item style={{ maxWidth: 100, margin: 12 }}>
            <TextField type="number" margin="normal" label={'Depth'} name='depth' value={this.state.depth} onChange={this.handleChange} />
          </Grid>

          <Grid item style={{ maxWidth: 150, margin: 12 }}>
            <TextField type="number" margin="normal" label={'Minimal edge weight'} name='freq_min' value={this.state.freq_min} onChange={this.handleChange} />
          </Grid>

          <Grid item style={{ maxWidth: 100, margin: 12 }}>
            <TextField type="number" margin="normal" label={'Window'} name='window' value={this.state.window} onChange={this.handleChange} />
          </Grid>

          <Grid item >
            <Button variant="contained" color="primary" onClick={this.handleGraphDraw} style={{ margin: 12 }}>Draw</Button>
          </Grid>

          <Grid item>
            {show_load}
          </Grid>
          {/*
          <Grid item >
            <Button  onClick={(e) => this.stepOfGraph(e, 'left')}>{'\u27F5'}</Button>
          </Grid>

          <Grid item >
            <Button  onClick={(e) => this.stepOfGraph(e, 'right')}>{'\u27F6'}</Button>
          </Grid>

          <Grid item style={{ maxWidth: 150, margin: 12 }}>
            <TextField type="number" label={'Step'} name='step' value={this.state.step} onChange={this.handleChange} />
          </Grid>
          */}
          

        </Grid>


      </div>
    )
  }
}

const mapStateToProps = state => ({
  graph: state.graph.graph,
  selection: state.reference.selection,
  complexity: state.reference.complexity
});

export default connect(mapStateToProps, { fetchGraph, putSelectedRef })(GraphContainer)