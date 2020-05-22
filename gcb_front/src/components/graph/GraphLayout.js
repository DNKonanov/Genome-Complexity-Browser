import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import CytoscapeDagreGraph from './CytoscapeDagreGraph'

import {connect} from 'react-redux';
import Grid from "@material-ui/core/Grid";

const mapStateToProps = state => ({
    graph: state.graph.graph
});

class GraphLayout extends Component {
    render() {
        let what_to_show = null;
        let notLoaded = () => (<div style={{display: 'flex', height: 300, width: '100%'}}>
            <Typography variant="h4" style={{margin: 'auto', textAlign: 'center'}}>
                Please, select parameters and click DRAW button
            </Typography>
        </div>);

        let cytoscapeDagreGraph = () => (
            < CytoscapeDagreGraph data={this.props.graph.data}
                                  layout={this.props.graph.params.layout}
            />
        );

        // console.log(what_to_show)
        return (
            <Grid container>
                <Grid item xs={12}>
                    {this.props.graph.result === 'NOT LOADED' ? notLoaded(): cytoscapeDagreGraph()}
                </Grid>
            </Grid>
        )
    }
}

export default connect(mapStateToProps)(GraphLayout)