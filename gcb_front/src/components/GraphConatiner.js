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

import CytoscapeDagreGraph from './CytoscapeDagreGraph'

import { fetchGraph } from '../redux/actions/graphActions'
import { connect } from 'react-redux';


class GraphContainer extends Component {

  state = {
    window: '5',
    tails: '5',
    depth: '30',
    freq_min: '2',
    layout: 'graphviz',
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleGraphDraw = () => {
    console.log('HANDLE DRAW BUTTON')
    let graph_params = {
      org: '',
      stamm: '',
      contig: '',
      og_start: '',
      og_end: '',
      window: '',
      tails: '',
      pars_int: '',
      operons_int: '',
      depth: '',
      freq_min: ''
    }

    // Get selector data from redux store
    let pars_int = 0
    // if (data_from_selector.pars === true) pars_int = 1

    let operons_int = 0
    // if (data_from_selector.operons === true) operons_int = 1

    // Get data from current component 
    graph_params.window = this.state.window;
    graph_params.tails = this.state.tails;
    graph_params.depth = this.state.depth;
    graph_params.freq_min = this.state.freq_min;

    // Make redux request
    this.props.fetchGraph(graph_params)
    
  }


  render() {
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
                onChange={this.handleChange}
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

        
        <CytoscapeDagreGraph data={this.props.data}/>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  graph: state.graph.graph
});

export default connect(mapStateToProps, { fetchGraph })(GraphContainer)