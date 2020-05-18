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
        this.props.setContainerGraph(event.target.name.toUpperCase(),event.target.value);
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
    if (this.props.complexity.OGs.indexOf(this.props.selection.og_start) ===-1) {
      alert('Start OG is not in chosen genome');
      return true
    }

    if (this.props.complexity.OGs.indexOf(this.props.selection.og_end) ===-1) {
      alert('End OG is not in chosen genome');
      return true
    }
    return false
  };

    // рисует. Плюс анимация загрузки
    handleGraphDraw = () => {
        if (this.checkOG() === true)
            return;
        // Make redux request
        let params = this.getGraphParams();
        this.props.fetchGraph(params);

        this.props.setContainerGraph(LOADING,true);
    };


    // заканчивает крутить анимацию по завершении обновления компонента
    componentDidUpdate(prevProps, prevState) {
        removeAllTips();
        if (this.props.graph.result === 'SUCCESS' && this.props.loading === true) {
            if (JSON.stringify(this.props.graph.params) === JSON.stringify(this.getGraphParams())) {
                this.props.setContainerGraph(LOADING,false);
            }
        }
    }

    render() {
        let show_load;
        if (this.props.loading) {
            show_load =
                <CircularProgress style={{margin: 'auto'}}
                                  size={40}
                />
        } else {
            show_load = <CircularProgress style={{margin: 'auto'}}
                                          variant='static'
                                          size={40}
            />
        }

        return (
            <div>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                        <Button variant="contained"
                                size="large"
                                color="primary"
                                onClick={this.handleGraphDraw}
                                style={{margin: 12}}
                        >
                            Draw
                        </Button>
                    </Grid>

                    <Grid item>
                        {show_load}
                    </Grid>

                </Grid>
            </div>
        )
    }
}


export default connect(mapStateToProps, actionsCreator)(GraphContainer)