import React from "react";
import {connect} from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";
import {useStyles} from "../../../../style/SelectParametersStyle";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {ExpansionPanel} from "@material-ui/core";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Switch from "@material-ui/core/Switch";
import removeAllTips from "../../../../../../../../sctipts/helper/functions/removeAllTips";
import RefTextFields from "../components/RefTextFields";
import {setContainerGraph} from "../../../../../../../../redux/actions/graph/container/actions";

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
        this.props.setContainerGraph(event.target.name.toUpperCase() ,event.target.value);
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
                                        <Grid container spacing={3} justify="center">
                                            <Grid item xs={6}>
                                                <Typography variant="h5"
                                                            component="h5"
                                                            gutterBottom
                                                >
                                                    Plot settings
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <RefTextFields
                                                    labelTF={'Start OG'}
                                                    nameTF={'og_start_s'}
                                                    valueTF={this.props.og_start_s}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RefTextFields
                                                    labelTF={'End OG'}
                                                    nameTF={'og_end_s'}
                                                    valueTF={this.props.og_end_s}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Divider className={classes.divider}/>

                                        <Grid container spacing={3} justify="center">
                                            <Grid item xs={6}>
                                                <Typography variant="h5"
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
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch name='hide_edges'
                                                                // value="checked"
                                                                checked={this.props.hide_edges}
                                                                color="primary"
                                                                onChange={this.handleChange}/>}
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