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
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Switch from "@material-ui/core/Switch";


const mapStateToProps = state => ({
    organisms: state.reference.organisms,
    stamms: state.reference.stamms,
    contigs: state.reference.contigs,

    complexity_windows: state.reference.complexity_windows,
    complexity: state.reference.complexity,
});

function removeAllTips() {
    let elements = document.getElementsByClassName('tippy-popper');
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

class OtherSettingsExpansionPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            complexity_window: 0,
            search_query: '',
            search_results: [],
            methods: [
                'by strains complexity',
                'probabilistic complexity',
            ],
            hide_edges: true,
            tails: 1,
            depth: 30,
            freq_min: 2,
            window: 5,
        };
    }

    // обновление стейта в общем виде
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    };

    handleLayout = event => {
        removeAllTips();
        this.setState({layout: event.target.value});
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
                                        {/*<Card>*/}
                                        {/*    <CardContent>*/}
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
                                                <TextField label={'Start OG'}
                                                           name='og_start'
                                                           value={this.state.og_start}
                                                           onChange={this.handleChange}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <TextField
                                                    label={'End OG'}
                                                    name='og_end'
                                                    value={this.state.og_end}
                                                    onChange={this.handleChange}
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
                                            {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
                                            <Grid item xs={6}>
                                                <FormControl component="fieldset">
                                                    <FormLabel component="legend">Layouter</FormLabel>
                                                    <RadioGroup
                                                        aria-label="layouter"
                                                        name="layouter"

                                                        value={this.state.layout}
                                                        onChange={this.handleLayout}
                                                        style={{display: 'inline'}}
                                                    >
                                                        <FormControlLabel value="dagre" control={<Radio/>}
                                                                          label="Dagre"/>
                                                        <FormControlLabel value="graphviz" control={<Radio/>}
                                                                          label="Graphviz"/>
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch name='hide_edges'
                                                                value="checked"
                                                                color="primary"
                                                                checked={this.state.hide_edges}
                                                                onChange={e => this.handleChange(e)}/>}
                                                    label="Hide reversed"
                                                />
                                            </Grid>
                                        </Grid>
                                        {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <TextField type="number"
                                                           margin="normal"
                                                           label={'Tails'}
                                                           name='tails'
                                                           value={this.state.tails}
                                                           onChange={this.handleChange}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField type="number"
                                                           margin="normal"
                                                           label={'Depth'}
                                                           name='depth'
                                                           value={this.state.depth}
                                                           onChange={this.handleChange}
                                                />
                                            </Grid>
                                        </Grid>
                                        {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <TextField type="number"
                                                           margin="normal"
                                                           label={'Minimal edge weight'}
                                                           name='freq_min'
                                                           value={this.state.freq_min}
                                                           onChange={this.handleChange}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
                                                <TextField type="number"
                                                           margin="normal"
                                                           label={'Minimal edge weight'}
                                                           name='freq_min'
                                                           value={this.state.freq_min}
                                                           onChange={this.handleChange}
                                                />
                                            </Grid>
                                        </Grid>
                                        {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}

                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <TextField type="number"
                                                           margin="normal"
                                                           label={'Window'}
                                                           name='window'
                                                           value={this.state.window}
                                                           onChange={this.handleChange}
                                                />
                                            </Grid>
                                        </Grid>
                                        {/*    </CardContent>*/}
                                        {/*</Card>*/}
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

const connectOther = connect(mapStateToProps)(OtherSettingsExpansionPanel);

export default withStyles(useStyles)(connectOther);