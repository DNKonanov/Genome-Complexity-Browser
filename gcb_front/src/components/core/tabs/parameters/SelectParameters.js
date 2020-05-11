import React from "react";
import Box from "@material-ui/core/Box";
import {Card, CardActions, ExpansionPanel} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import {connect} from 'react-redux';
import {fetchOrganisms} from "../../../../redux/actions/referenceActions";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
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

const actionCreators = {
    fetchOrganisms: fetchOrganisms,
};

function removeAllTips() {
    let elements = document.getElementsByClassName('tippy-popper');
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

class SelectParameters extends React.Component {
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
        };
    }

    handleLayout = event => {
        removeAllTips();
        this.setState({layout: event.target.value});
    };
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                        <Container fixed>
                            <Box>
                                <Card className={this.props.cardInDrawer}>
                                    <CardContent>
                                        <Grid container justify="center">
                                            <Typography variant='h5'>Reference parameters</Typography>
                                        </Grid>

                                        <Divider className={classes.divider}/>

                                        <Grid container justify="center" spacing={1}>
                                            <Grid item xs={4}>
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel htmlFor="org">Organism</InputLabel>
                                                    <Select value={this.state.org}
                                                            name='org'
                                                            input={<Input name="org" id="org"/>}
                                                            onChange={this.handleChange}
                                                    >
                                                        {this.props.organisms.map(org => <MenuItem key={org}
                                                                                                   value={org}>{org}</MenuItem>)}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={4}>
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel htmlFor="stamm">Reference</InputLabel>
                                                    <Select value={this.state.stamm}
                                                            name='stamm'
                                                            onChange={this.handleChange}
                                                    >
                                                        {this.props.stamms.list.map(stamm => <MenuItem key={stamm}
                                                                                                       value={stamm}> {stamm + ' (' + this.props.stamms.names[this.props.stamms.list.indexOf(stamm)] + ')'} </MenuItem>)}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={4}>
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel htmlFor="contig">Contig:</InputLabel>
                                                    <Select value={this.state.contig} name='contig'
                                                            onChange={this.handleChange}>
                                                        {this.props.contigs.list.map(contig => <MenuItem key={contig}
                                                                                                         value={contig}> {contig} </MenuItem>)}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>

                                        <Divider className={classes.divider}/>

                                        <Grid container spacing={1} justify="center">
                                            <Grid item xs={6}>
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel htmlFor="method">Method</InputLabel>
                                                    <Select value={this.state.method} name='method'
                                                            onChange={this.handleChange}
                                                    >
                                                        {this.state.methods.map(method => (
                                                            <MenuItem key={method} value={method}> {method} </MenuItem>)
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel htmlFor="complexity_window">Window</InputLabel>
                                                    <Select value={this.state.complexity_window}
                                                            name='complexity_window'
                                                            onChange={this.handleChange}>
                                                        {this.props.complexity_windows.list.map(complexity_window =>
                                                            <MenuItem
                                                                key={complexity_window}
                                                                value={complexity_window}> {complexity_window} </MenuItem>)}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>

                                        <Divider className={classes.divider}/>

                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <TextField label={'Start coordinate'}
                                                           name='coord_start'
                                                           value={this.state.coord_start}
                                                           onChange={this.handleChange}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <TextField label={'End coordinate'}
                                                           name='coord_end'
                                                           value={this.state.coord_end}
                                                           onChange={this.handleChange}
                                                />
                                            </Grid>
                                        </Grid>


                                        <Divider className={classes.divider}/>
                                    </CardContent>

                                    <CardActions>
                                        <Button style={{margin: 12}}
                                                color='primary'
                                                variant='contained'
                                                onClick={(e) => {
                                                    this.checkOGs(e)
                                                }}
                                        >
                                            Update genes
                                        </Button>

                                        <Button style={{margin: 12}}
                                                color='primary'
                                                variant='contained'
                                                onClick={(e) => {
                                                    this.checkCoord(e)
                                                }}
                                        >
                                            Update coordinates
                                        </Button>

                                    </CardActions>
                                </Card>
                            </Box>
                        </Container>
                    </Grid>
                </Grid>
                {/*----------------------------------------------Other settings-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
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
                                            <Grid item xs={3}>
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
                                            <Grid item xs={3}>
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
                                            <Grid item xs={3}>
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


const useStyles = theme => ({
    divider: {
        margin: theme.spacing(2, 0),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
});
const connectSelectParameters = connect(mapStateToProps, actionCreators)(SelectParameters);
export default withStyles(useStyles)(connectSelectParameters);