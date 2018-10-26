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

import { connect } from 'react-redux';


class GraphLayout extends Component {



    

    render() {
        let what_to_show = null
        if (this.props.graph.result === 'NOT LOADED') {
        what_to_show =
            <div style={{ display: 'flex', height: 300, width: '100%' }}>
            <Typography variant="h4" style={{ margin: 'auto', textAlign: 'center' }} > Please, select parameters and click DRAW button</Typography>
            </div>
        }
        else {

            what_to_show = < CytoscapeDagreGraph data={this.props.graph.data} layout={this.props.graph.params.layout} />
        }

        // console.log(what_to_show)
        return (
            <div>
                {what_to_show}
            </div>
        )
        }
    }

const mapStateToProps = state => ({
    graph: state.graph.graph
});

export default connect(mapStateToProps)(GraphLayout)