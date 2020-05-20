import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import CytoscapeDagreGraph from './CytoscapeDagreGraph'

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    graph: state.graph.graph
});

class GraphLayout extends Component {
    render() {
        let what_to_show = null;
        if (this.props.graph.result === 'NOT LOADED') {
            what_to_show =
                <div style={{
                    display: 'flex',
                    height: 300,
                    width: '100%'
                }}
                >
                    <Typography variant="h4"
                                style={{
                                    margin: 'auto',
                                    textAlign: 'center'
                                }}
                    > Please, select parameters and click DRAW button</Typography>
                </div>
        } else {
            what_to_show =
                < CytoscapeDagreGraph data={this.props.graph.data}
                                      layout={this.props.graph.params.layout}
                />
        }

        // console.log(what_to_show)
        return (
            <div>
                {what_to_show}
            </div>
        )
    }
}

export default connect(mapStateToProps)(GraphLayout)