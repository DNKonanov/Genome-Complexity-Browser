import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {putSelectedRef} from '../../redux/actions/referenceActions';
import {fetchGraph} from '../../redux/actions/graph/graphActions'
import {connect} from 'react-redux';
import {setContainerGraph} from "../../redux/actions/graph/container/actions";
import removeAllTips from "../../sctipts/helper/functions/removeAllTips";
import {LOADING} from "../../redux/constants/graph/container/constants";
import Typography from "@material-ui/core/Typography";
import CytoscapeDagreGraph from "./CytoscapeDagreGraph";
import RefTextFields from "../core/tabs/parameters/components/expansion/reference/components/RefTextFields";
import Tooltip from "@material-ui/core/Tooltip";
import {setCoordStartCoordEnd, setOgStartOgEnd} from "../../redux/actions/selector/actions";

const mapStateToProps = state => ({
    graph: state.graph.graph,
    selection: state.reference.selection,
    complexity: state.reference.complexity,
    // container
    window: state.container.window,
    tails: state.container.tails,
    depth: state.container.depth,
    freq_min: state.container.freq_min,
    layout: state.container.layout,

    loading: state.container.loading,

    step: state.container.step,
    hide_edges: state.container.hide_edges,


    coord_start: state.requisite.coord_start,
    coord_end: state.requisite.coord_end,

    og_start_s: state.requisite.og_start_s,
    og_end_s: state.requisite.og_start_s,


});

const actionsCreator = {
    setContainerGraph: setContainerGraph,

    fetchGraph: fetchGraph,
    putSelectedRef: putSelectedRef,
    setOgStartOgEnd: setOgStartOgEnd,
    setCoordStartCoordEnd: setCoordStartCoordEnd,
};

class GraphContainer extends Component {
    // просто меняет стейт но с некоторыми проверками
    handleChange = (event) => {
        if (event.target.name === 'depth') {
            if (event.target.value < 2) {
                return
            }
        }

        if ((event.target.name === 'freq_min') || (event.target.name === 'window')) {
            if (event.target.value < 1) {
                return
            }
        }

        if (event.target.name === 'tails') {
            if (event.target.value < 0) {
                return
            }
        }

        if (event.target.name === 'hide_edges') {
            console.log('---');
            console.log(event.target.checked);
            this.setState({
                hide_edges: event.target.checked,
            });

            console.log(this.state.hide_edges);
            return
        }
        // this.setState({[event.target.name]: event.target.value});
        this.props.setContainerGraph(event.target.name.toUpperCase(), event.target.value);
    };

    // забирает из пропсов все параметры графа и добавляет свои
    getGraphParams() {
        // Get selector data from redux store
        let sel = this.props.selection;

        // Get data from current component
        let graph_params = {
            org: sel.org,
            stamm: sel.stamm,
            contig: sel.contig,
            og_start: sel.og_start,
            og_end: sel.og_end,
            pars_int: sel.pars_int.toString(),
            operons_int: sel.operons_int.toString(),
            complexity_window: sel.complexity_window,

            window: this.props.window,
            tails: this.props.tails,
            hide_edges: this.props.hide_edges.toString(),
            depth: this.props.depth,
            freq_min: this.props.freq_min,
            layout: this.props.layout,
        };

        return graph_params
    }

    // проверает наличие нодов из стейта в загруженном списке нодов
    checkOG = () => {
        if (this.props.complexity.OGs.indexOf(this.props.selection.og_start) === -1) {
            alert('Start OG is not in chosen genome');
            return true
        }

        if (this.props.complexity.OGs.indexOf(this.props.selection.og_end) === -1) {
            alert('End OG is not in chosen genome');
            return true
        }
        return false
    };

    checkOGs = (event) => {
        console.log('OG checked!');
        let close_st_gene = 0;
        let close_end_gene = 0;
        let close_st_len = Math.abs(this.props.complexity.coord_list[0] - this.props.coord_start);
        let close_end_len = Math.abs(this.props.complexity.coord_list[0] - this.props.coord_start);

        for (let i = 0; i < this.props.complexity.coord_list.length; i++) {
            let len = Math.abs(this.props.complexity.coord_list[i] - this.props.coord_start);
            if (len < close_st_len) {
                close_st_gene = i;
                close_st_len = len
            }
            len = Math.abs(this.props.complexity.coord_list[i] - this.props.coord_end);
            if (len < close_end_len) {
                close_end_gene = i;
                close_end_len = len
            }
        }

        if (this.props.complexity.OGs[close_st_gene] !== undefined && this.props.complexity.OGs[close_end_gene] !== undefined) {
            this.props.setOgStartOgEnd(this.props.complexity.OGs[close_st_gene], this.props.complexity.OGs[close_end_gene])
        }
    };

    checkCoord = (event) => {
        let coord_start = -1;
        let coord_end = -1;

        for (let i = 0; i < this.props.complexity.OGs.length; i++) {
            if (this.props.complexity.OGs[i] === this.props.og_start_s) {
                coord_start = this.props.complexity.coord_list[i];
            }
            if (this.props.complexity.OGs[i] === this.props.og_end_s) {
                coord_end = this.props.complexity.coord_list[i];
            }
        }

        if (coord_start === -1) {
            alert('Start OG is not in chosed genome!')
        } else if (coord_end === -1) {
            alert('Eng OG is not in chosed genome!')
        }

        if (coord_start !== -1 && coord_end !== -1) {
            this.props.setCoordStartCoordEnd(coord_start, coord_end);
        }
    };

    // рисует. Плюс анимация загрузки
    handleGraphDraw = () => {
        this.checkOGs();
        this.checkCoord();


        this.props.setContainerGraph(LOADING, true);

        if (this.checkOG() === true)
            return;
        // Make redux request
        let params = this.getGraphParams();

        this.props.fetchGraph(params);

    };


    // заканчивает крутить анимацию по завершении обновления компонента
    componentDidUpdate(prevProps, prevState) {
        removeAllTips();
        if (this.props.graph.result === 'SUCCESS' && this.props.loading === true) {
            // if (this.props.graph.result === 'SUCCESS') {
            if (JSON.stringify(this.props.graph.params) === JSON.stringify(this.getGraphParams())) {
                // this.props.setContainerGraph(LOADING, false);
            }
        }
    }

    render() {
        let what_to_show = null;
        let notLoaded = () => (
            <div style={{display: 'flex', height: 300, width: '100%'}}>
                <Typography variant="h4" style={{margin: 'auto', textAlign: 'center'}}>
                    Please, select parameters and click DRAW button
                </Typography>
            </div>

        );

        let cytoscapeDagreGraph = () => (
            < CytoscapeDagreGraph data={this.props.graph.data}
                                  layout={this.props.graph.params.layout}
            />
        );

        return (
            <div>
                <Grid container
                      direction="row"
                      justify="flex-start"
                      alignItems="center"
                      spacing={1}
                >
                    <Grid item xs={2}>
                        {/*НЕ УДАЛЯТЬ!!!!*/}
                        <Button variant="contained"
                                id="graphButtonDraw"
                                size="large"
                                color="primary"
                                onClick={this.handleGraphDraw}
                                style={{
                                    margin: 12,
                                    display: 'none'
                                }}
                        >
                            Draw
                        </Button>

                        <RefTextFields
                            labelTF={'Depth'}
                            nameTF={'depth'}
                            valueTF={this.props.depth}
                            typeTF={"number"}
                            errTF={this.props.depth < 2}
                            helperTextTF={this.props.depth < 2 ? 'Greater than or equal to two' : ''}
                        />


                    </Grid>

                    <Grid item xs={2}>
                        <RefTextFields
                            labelTF={'Window'}
                            nameTF={'window'}
                            valueTF={this.props.window}
                            typeTF={"number"}
                            errTF={this.props.window < 1}
                            helperTextTF={this.props.window < 1 ? 'Greater than or equal to one' : ''}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <RefTextFields
                            labelTF={'Tails OG'}
                            nameTF={'tails'}
                            valueTF={this.props.tails}
                            typeTF={"number"}
                            errTF={this.props.tails < 0}
                            helperTextTF={this.props.tails < 0 ? 'Greater than or equal to zero' : ''}

                        />
                    </Grid>

                    <Grid item xs={2}>
                        <RefTextFields
                            labelTF={'Minimal edge weight'}
                            nameTF={'freq_min'}
                            valueTF={this.props.freq_min}
                            typeTF={"number"}
                            errTF={this.props.freq_min < 1}
                            helperTextTF={this.props.freq_min < 1 ? 'Greater than or equal to one' : ''}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <a href="#GraphShowOnClick"
                           style={{
                               color: 'white',
                               textDecoration: 'none',
                           }}
                        > <Tooltip title={'helper'}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={this.handleGraphDraw}
                            >
                                UPDATE
                            </Button>
                        </Tooltip>
                        </a>
                    </Grid>

                    <Grid item xs={12}>
                        {this.props.graph.result === 'NOT LOADED' ? notLoaded() : cytoscapeDagreGraph()}
                    </Grid>


                </Grid>
            </div>
        )
    }
}


export default connect(mapStateToProps, actionsCreator)(GraphContainer)