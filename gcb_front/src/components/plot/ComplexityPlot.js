import React from "react";
import Grid from "@material-ui/core/Grid";
import {withStyles} from "@material-ui/core";
import Plot from "react-plotly.js";
import {connect} from 'react-redux';
import {setRequisite} from "../../redux/actions/selector/actions";
import {COORD_END, COORD_START, OG_END_S, OG_START_S} from "../../redux/constants/selector/constants";

const mapStateToProps = state => ({
    // reference
    complexity_windows: state.reference.complexity_windows,
    complexity: state.reference.complexity,
    /// requisite
    coord_start: state.requisite.coord_start,
    coord_end: state.requisite.coord_end,
    draw_type: state.requisite.draw_type,
    // file
    userCoordinates: state.file.userCoordinates,
    userValues: state.file.userValues,
    maxUserValue: state.file.maxUserValue,
});

const actionsCreator = {
    setRequisite: setRequisite
};

class ComplexityPlot extends React.Component {
    render() {
        const data = this.props.complexity;
        return (
            <div>
                <Grid container
                      direction="column"
                      justify="flex-start"
                      alignItems="stretch"
                >
                    <Grid item xs={12}>
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
                                    x: [this.props.coord_start, this.props.coord_start],
                                    y: [-data.max_complexity / 2, data.max_complexity],
                                    mode: 'lines',
                                    name: 'left edge'
                                },
                                {
                                    x: [this.props.coord_end, this.props.coord_end],
                                    y: [-data.max_complexity / 2, data.max_complexity],
                                    mode: 'lines',
                                    name: 'rigth edge'
                                },

                                {
                                    x: this.props.userCoordinates,
                                    y: this.props.userValues,
                                    mode: this.props.draw_type,
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
                                        range: [-data.max_complexity, data.max_complexity],
                                        title: 'complexity',
                                        overlaying: 'y2'
                                    },

                                    yaxis2: {
                                        range: [-this.props.maxUserValue, this.props.maxUserValue],
                                        title: 'user values',
                                        side: 'right'
                                    }
                                }
                            }
                            useResizeHandler={true}
                            style={{width: "100%", height: "400"}}
                            onClick={(data) => {
                                this.props.setRequisite(OG_START_S, data.points[0].text);
                                this.props.setRequisite(OG_END_S, data.points[0].text);
                                this.props.setRequisite(COORD_START, data.points[0].text);
                                this.props.setRequisite(COORD_END, data.points[0].text);
                            }}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const useStyle = theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
});
const connectComplexityPlot = connect(mapStateToProps, actionsCreator)(ComplexityPlot);
export default withStyles(useStyle)(connectComplexityPlot);