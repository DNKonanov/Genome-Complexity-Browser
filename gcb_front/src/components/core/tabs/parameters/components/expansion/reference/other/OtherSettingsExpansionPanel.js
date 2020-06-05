import React from "react";
import {connect} from 'react-redux';
import {useStyles} from "../../../../style/SelectParametersStyle";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import removeAllTips from "../../../../../../../../sctipts/helper/functions/removeAllTips";
import RefTextFields from "../components/RefTextFields";
import {setContainerGraph} from "../../../../../../../../redux/actions/graph/container/actions";
import HelpIcon from '@material-ui/icons/Help';
import {
    Box,
    Container,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    Switch,
    Tooltip,
    Typography,
    withStyles
} from '@material-ui/core';

const mapStateToProps = state => ({
    organisms: state.reference.organisms,
    stamms: state.reference.stamms,
    contigs: state.reference.contigs,

    complexity_windows: state.reference.complexity_windows,
    complexity: state.reference.complexity,
    // requisite
    og_start_s: state.requisite.og_start_s,
    og_end_s: state.requisite.og_start_s,
    // container
    layout: state.container.layout,
    hide_edges: state.container.hide_edges,

    window: state.container.window,
    tails: state.container.tails,
    depth: state.container.depth,
    freq_min: state.container.freq_min,
    loading: state.container.loading,
    step: state.container.step,
    cy: state.container.cy,
    edge_description: state.container.edge_description,
    json_format: state.container.json_format,
    selected_nodes: state.container.selected_nodes,
    user_colors: state.container.user_colors,
});
const actionCreators = {
    //requisite
    setContainerGraph: setContainerGraph,
};

class OtherSettingsExpansionPanel extends React.Component {

    handleChange = (e) => {
        e.preventDefault();
        this.props.setContainerGraph(e.target.name.toUpperCase(), !this.props.hide_edges);
    };

    handleLayout = event => {
        event.preventDefault();
        removeAllTips();
        this.props.setContainerGraph(event.target.name.toUpperCase(), event.target.value);
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                        <Container fixed>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                    <Typography>Other settings</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>

                                    <Box>


                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <Typography variant="h6"
                                                            component="h5"
                                                            gutterBottom
                                                >
                                                    Graph settings
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={6}>
                                            <Grid item xs={6}>
                                                <FormControl component="fieldset">
                                                    <FormLabel component="legend">Layouter</FormLabel>
                                                    <Tooltip title={'helper'}>
                                                        <RadioGroup
                                                            name="layout"
                                                            value={this.props.layout}
                                                            onChange={this.handleLayout}

                                                            aria-label="layouter"
                                                            style={{display: 'inline'}}
                                                        >
                                                            <FormControlLabel value="dagre"
                                                                              control={<Radio/>}
                                                                              label="Dagre"
                                                            />
                                                            <FormControlLabel value="graphviz"
                                                                              control={<Radio/>}
                                                                              label="Graphviz"
                                                            />
                                                        </RadioGroup>
                                                    </Tooltip>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                    control={
                                                        <Tooltip title={'helper'}>
                                                            <Switch name='hide_edges'
                                                                // value="checked"
                                                                    checked={this.props.hide_edges}
                                                                    color="primary"
                                                                    onChange={this.handleChangeContainer}
                                                            />
                                                        </Tooltip>
                                                    }
                                                    label="Hide reversed"
                                                />
                                            </Grid>

                                        </Grid>
                                        {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <RefTextFields
                                                    labelTF={'Tails OG'}
                                                    nameTF={'tails'}
                                                    valueTF={this.props.tails}
                                                    typeTF={"number"}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <RefTextFields
                                                    labelTF={'Depth'}
                                                    nameTF={'depth'}
                                                    valueTF={this.props.depth}
                                                    typeTF={"number"}
                                                />
                                            </Grid>
                                        </Grid>
                                        {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <RefTextFields
                                                    labelTF={'Minimal edge weight'}
                                                    nameTF={'freq_min'}
                                                    valueTF={this.props.freq_min}
                                                    typeTF={"number"}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RefTextFields
                                                    labelTF={'Window'}
                                                    nameTF={'window'}
                                                    valueTF={this.props.window}
                                                    typeTF={"number"}
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <RefTextFields
                                                    labelTF={'Start OG'}
                                                    nameTF={'og_start_s'}
                                                    valueTF={this.props.og_start_s}
                                                    disTF={true}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RefTextFields
                                                    labelTF={'End OG'}
                                                    nameTF={'og_end_s'}
                                                    valueTF={this.props.og_end_s}
                                                    disTF={true}
                                                />
                                            </Grid>
                                        </Grid> */}
                                    </Box>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Container>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const connectOther = connect(mapStateToProps, actionCreators)(OtherSettingsExpansionPanel);

export default withStyles(useStyles)(connectOther);