import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import {putSelectedRef} from '../../redux/actions/referenceActions';
import {fetchGraph} from '../../redux/actions/graph/graphActions'
import {connect} from 'react-redux';
import {setContainerGraph} from "../../redux/actions/graph/container/actions";
import removeAllTips from "../../sctipts/helper/functions/removeAllTips";
import {LOADING} from "../../redux/constants/graph/container/constants";
import Typography from "@material-ui/core/Typography";
import CytoscapeDagreGraph from "./CytoscapeDagreGraph";
import RefTextFields from "../core/tabs/parameters/components/expansion/reference/components/RefTextFields";

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
});

const actionsCreator = {
    setContainerGraph: setContainerGraph,

    fetchGraph: fetchGraph,
    putSelectedRef: putSelectedRef,
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

    // рисует. Плюс анимация загрузки
    handleGraphDraw = () => {
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
                            labelTF={'Window'}
                            nameTF={'window'}
                            valueTF={this.props.window}
                            typeTF={"number"}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <RefTextFields
                            labelTF={'Depth'}
                            nameTF={'depth'}
                            valueTF={this.props.depth}
                            typeTF={"number"}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <RefTextFields
                            labelTF={'Tails OG'}
                            nameTF={'tails'}
                            valueTF={this.props.tails}
                            typeTF={"number"}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <RefTextFields
                            labelTF={'Minimal edge weight'}
                            nameTF={'freq_min'}
                            valueTF={this.props.freq_min}
                            typeTF={"number"}
                        />
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