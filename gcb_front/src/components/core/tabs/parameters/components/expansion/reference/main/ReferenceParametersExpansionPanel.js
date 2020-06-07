import React from "react";
import {connect} from 'react-redux';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {useStyles} from "../../../../style/SelectParametersStyle";
import {
    fetchComplexity,
    fetchContigs,
    fetchOrganisms,
    fetchStammsForOrg,
    fetchWindows,
    putSelectedRef
} from "../../../../../../../../redux/actions/referenceActions";

import {setContainerGraph} from "../../../../../../../../redux/actions/graph/container/actions";
import {
    setCoordStartCoordEnd,
    setOgStartOgEnd,
    setRequisite,
    setStammGenomeName,
} from "../../../../../../../../redux/actions/selector/actions";
import {CONTIG, GENOME_NAME, STAMM} from "../../../../../../../../redux/constants/selector/constants";
import RefSelect from "../components/RefSelect";
import GenomeSelector from "../components/GenomeSelector";
import RefTextFields from "../components/RefTextFields";
import removeAllTips from "../../../../../../../../sctipts/helper/functions/removeAllTips";
import {setIs_open_drawer, setCurrentTab} from "../../../../../../../../redux/actions/layout/actions";
import {
    Box,
    Button,
    Container,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControlLabel,
    Grid,
    LinearProgress,
    Switch,
    Tooltip,
    Typography,
    FormControl,
    FormLabel,
    Radio,
    RadioGroup,
    withStyles,
    ThemeProvider
} from '@material-ui/core';


const mapStateToProps = state => ({
    organisms: state.reference.organisms,
    stamms: state.reference.stamms,
    contigs: state.reference.contigs,
    complexity_windows: state.reference.complexity_windows,

    complexity: state.reference.complexity,

    og_start: state.reference.selection.og_start,
    og_end: state.reference.selection.og_end,
    /// requisite
    org: state.requisite.org,
    stamm: state.requisite.stamm,
    genome_name: state.requisite.genome_name,
    method: state.requisite.method,
    methods: state.requisite.methods,
    contig: state.requisite.contig,

    og_start_s: state.requisite.og_start_s,
    og_end_s: state.requisite.og_start_s,

    coord_start: state.requisite.coord_start,
    coord_end: state.requisite.coord_end,

    pars: state.requisite.pars,
    operons: state.requisite.operons,

    draw_types: state.requisite.draw_types,
    draw_type: state.requisite.draw_type,

    data: state.requisite.data,
    src: state.requisite.src,

    complexity_window: state.requisite.complexity_window,

    // 23.05.2020
    show_hotspots: state.requisite.show_hotspots,
    coef: state.requisite.coef,

    // componentsProps
    disabled_select_reference: state.components.select.disabled_select_reference,

    is_open_drawer: state.layout.leftMenu.is_open_drawer,
    current_tab: state.layout.leftMenu.current_tab,

    loading: state.container.loading,
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
    fetchOrganisms: fetchOrganisms,
    fetchContigs: fetchContigs,
    fetchWindows: fetchWindows,
    fetchStammsForOrg: fetchStammsForOrg,
    fetchComplexity: fetchComplexity,
    putSelectedRef: putSelectedRef,
    //requisite
    setRequisite: setRequisite, // main
    setCurrentTab: setCurrentTab,

    setOgStartOgEnd: setOgStartOgEnd,
    setCoordStartCoordEnd: setCoordStartCoordEnd,
    setStammGenomeName: setStammGenomeName,
    // components
    setIs_open_drawer: setIs_open_drawer,
    setCurrentTab: setCurrentTab,
    // graph
    setContainerGraph: setContainerGraph,
};

class ReferenceParametersExpansionPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            countClick: 0,
        };
    };

    componentDidMount() {

        if (this.props.organisms.length === 0)
            this.props.fetchOrganisms();
        return;
    };

    // обновление стейта в общем виде
    handleChange = (e) => {
        e.preventDefault();
        this.props.setRequisite(e.target.name.toUpperCase(), !this.props.show_hotspots);
    };

    handleChangeContainer = (e) => {
        e.preventDefault();
        this.props.setContainerGraph(e.target.name.toUpperCase(), !this.props.hide_edges);
    };

    handleChangePars = (e) => {
        e.preventDefault();
        this.props.setRequisite(e.target.name.toUpperCase(), !this.props.pars);
    };

    handleLayout = event => {
        event.preventDefault();
        removeAllTips();
        this.props.setContainerGraph(event.target.name.toUpperCase(), event.target.value);
    };

    componentDidUpdate(prevProps, prevState) {

        removeAllTips();
        if (this.props.organisms.length > 0) {// This means we succesfully loaded list of organisms
            if (this.props.stamms.org !== this.props.org) { //Stamms for selected organims are not loaded
                this.props.fetchStammsForOrg(this.props.org);
                return;

            } else { // stamms loaded
                if (!this.isInArray(this.props.stamms.list, this.props.stamm)) { //selected stamm is not from list
                    // this.props.setStammGenomeName(this.props.stamms.list[0],this.props.stamms.names[0]);
                    this.props.setRequisite(STAMM, this.props.stamms.list[0]);
                    this.props.setRequisite(GENOME_NAME, this.props.stamms.names[0]);

                } else { //selected stamm is from current list
                    if (this.props.contigs.stamm !== this.props.stamm) { //contigs for stamm not loaded
                        this.props.fetchContigs(this.props.org, this.props.stamm);
                        return;

                    } else { //selected stamm is from current list
                        if (this.props.complexity_windows.stamm !== this.props.stamm) { //contigs for stamm not loaded
                            this.props.fetchWindows(this.props.org, this.props.stamm);
                            return;

                        } else {//contigs loaded
                            if (!this.isInArray(this.props.contigs.list, this.props.contig)) { //selected stamm is not from list
                                this.props.setRequisite(CONTIG, this.props.contigs.list[0]);
                            } else {

                                let comp_par = this.props.complexity.request;

                                this.props.putSelectedRef(
                                    this.props.org,
                                    this.props.stamm,
                                    this.props.contig,
                                    this.props.og_start_s,
                                    this.props.og_end_s,
                                    this.props.method,
                                    this.props.pars,
                                    this.props.operons,
                                    this.props.complexity_window
                                );

                                if (comp_par.org !== this.props.org || comp_par.stamm !== this.props.stamm ||
                                    comp_par.contig !== this.props.contig || comp_par.method !== this.props.method ||
                                    comp_par.pars !== this.props.pars || comp_par.complexity_window !== this.props.complexity_window
                                    || comp_par.coef !== this.props.coef) {

                                    this.props.fetchComplexity(
                                        this.props.org,
                                        this.props.stamm,
                                        this.props.contig,
                                        this.props.method,
                                        this.props.pars,
                                        this.props.complexity_window,

                                        this.props.coef
                                    )

                                } else {
                                    if (this.props.og_start !== this.props.og_start_s || this.props.og_end !== this.props.og_end_s) {

                                        this.props.putSelectedRef(
                                            this.props.org,
                                            this.props.stamm,
                                            this.props.contig,
                                            this.props.og_start_s,
                                            this.props.og_end_s,
                                            this.props.method,
                                            this.props.pars,
                                            this.props.operons,
                                            this.props.complexity_window
                                        );

                                    } else {

                                        if (prevProps.coord_start !== this.props.coord_start || prevProps.coord_end !== this.props.coord_end) {
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

                                                this.props.setOgStartOgEnd(this.props.complexity.OGs[close_st_gene], this.props.complexity.OGs[close_end_gene]);

                                                this.props.putSelectedRef(
                                                    this.props.org,
                                                    this.props.stamm,
                                                    this.props.contig,
                                                    this.props.complexity.OGs[close_st_gene],
                                                    this.props.complexity.OGs[close_end_gene],
                                                    this.props.pars,
                                                    this.props.method,
                                                    this.props.operons,
                                                    this.props.complexity_window,
                                                );
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    render() {


        const {classes} = this.props;

        let genomes_loading

        if (this.props.organisms.length === 0) {
            genomes_loading = <Typography>Request genomes...</Typography>
        }

        else {
            genomes_loading = ''
        }
        
        return (
            <div>
                <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                        <Container fixed>
                                    <Box>
                                        <Grid container>
                                            <Typography variant='h6'>Select genome</Typography>
                                        </Grid>
                                        {genomes_loading}
                                        <Divider className={classes.divider}/>

                                        <Grid container
                                              justify="center"
                                              spacing={3}
                                              direction="column"
                                        >
                                            <Grid item xs={12}>
                                                <RefSelect
                                                    selectNameId={'org'}
                                                    selectValue={this.props.org}
                                                    inputLabel={'Organism'}
                                                    selectOptions={this.props.organisms} // array
                                                    disabledSelect={false}
                                                    focusedSelect={true}
                                                    tooltipText={<React.Fragment>
                                                                    <Typography variant='body2' color="inherit">
                                                                    Choose a set of genomes on the basis of which the graph is built and complexity values are calculated
                                                                    </Typography>
                                                                </React.Fragment>}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <GenomeSelector
                                                    inputLabel={'Reference'}
                                                    selectNameId={'stamm'}
                                                    selectValue={this.props.stamm}
                                                    selectOptions={this.props.stamms.list} // arr
                                                    disabledSelect={this.props.disabled_select_reference}
                                                    names={this.props.stamms.names}
                                                    tooltipText={<React.Fragment>
                                                        
                                                        <Typography variant='body2' color="inherit">
                                                        Select the genome, region for graph representation, and parameters
                                                        </Typography>
                                                    </React.Fragment>}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <RefSelect
                                                    inputLabel={'Contig'}
                                                    selectNameId={'contig'}
                                                    selectValue={this.props.contig}
                                                    selectOptions={this.props.contigs.list} //arr
                                                    disabledSelect={this.props.disabled_select_reference}
                                                    tooltipText={<React.Fragment>
                                                                    <Typography variant='body2' color="inherit">
                                                                    Select a contig (for draft genomes) or replicon from the reference genome
                                                                    </Typography>
                                                                </React.Fragment>}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Divider className={classes.divider}/>
                                        

                                        <Tooltip
                                            title={<React.Fragment>
                                                        <Typography variant='body2' color="inherit">
                                                        The region of the reference genome between the start and end 
                                                        coordinates will be shown in graph form. The number of genes 
                                                        specified in the 'neighborhood' parameter will be added on 
                                                        the left and right to the selected region. 
                                                        
                                                        </Typography>
                                                        <br></br>
                                                        <Typography>

                                                        Length of the region 
                                                        should not exceed 100 k.b.p
                                                        </Typography>
                                                    </React.Fragment>}
                                        >
                                            <Grid container>
                                                <Typography variant='h6'>Select region to draw graph</Typography>
                                            </Grid>

                                        </Tooltip>
                                        
                                        <br></br>

                                        {/*TEXT FIELDS*/}
                                        <Grid container justify="flex-start" spacing={3}>
                                            <Grid item xs={6}>
                                                <RefTextFields
                                                    tooltipText=''
                                                    labelTF={'Start coordinate'}
                                                    nameTF={'coord_start'}
                                                    valueTF={this.props.coord_start}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RefTextFields
                                                    tooltipText=''
                                                    labelTF={'End coordinate'}
                                                    nameTF={'coord_end'}
                                                    valueTF={this.props.coord_end}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Divider className={classes.divider}/>
                                        {/*BUTTONS*/}
                                        <Grid container justify="flex-start" spacing={3}>
                                            {/*    <Grid item xs={6}>*/}
                                            {/*        <Button*/}
                                            {/*            fullWidth*/}
                                            {/*            color='primary'*/}
                                            {/*            variant='outlined'*/}
                                            {/*            onClick={(e) => {*/}
                                            {/*                this.checkOGs(e)*/}
                                            {/*            }}*/}
                                            {/*            disabled={this.props.disabled_select_reference}*/}
                                            {/*        >*/}
                                            {/*            Update genes*/}
                                            {/*        </Button>*/}
                                            {/*    </Grid>*/}
                                            {/*    <Grid item xs={6}>*/}
                                            {/*        <Button*/}
                                            {/*            fullWidth*/}
                                            {/*            color='primary'*/}
                                            {/*            variant='outlined'*/}
                                            {/*            onClick={(e) => {*/}
                                            {/*                this.checkCoord(e)*/}
                                            {/*            }}*/}
                                            {/*            disabled={this.props.disabled_select_reference}*/}
                                            {/*        >*/}
                                            {/*            Update coordinates*/}
                                            {/*        </Button>*/}
                                            {/*    </Grid>*/}

                                            <Grid item xs={12}>
                                                <a href="#GraphShowOnClick"
                                                   style={{
                                                       color: 'white',
                                                       textDecoration: 'none',
                                                   }}
                                                >
                                                    <div style={{
                                                        display: this.props.loading ? '' : 'none'
                                                    }}>
                                                        <LinearProgress/>
                                                    </div>
                                                    <Tooltip 
                                                        title={<Typography variant='body2'>
                                                            Show the graph corresponding to the selected region in the Graph panel
                                                            </Typography>}
                                                        >
                                                        <Button size="large"
                                                                variant="outlined"
                                                                color="default"
                                                                onClick={this.handleDraw}
                                                                disableElevation
                                                                fullWidth
                                                                disabled={this.props.disabled_select_reference === true &&
                                                                this.props.loading === false ? true : this.props.loading}
                                                        >
                                                            DRAW GRAPH
                                                        </Button>
                                                    </Tooltip>
                                                </a>
                                            </Grid>
                                        </Grid>

                                        {/*-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
                                        <br></br>

                                        
                                        <ExpansionPanel>
                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                                <Tooltip
                                                    title={<Typography variant='body2'>
                                                        Show advanced settings of the complexity profile and graph plots
                                                    </Typography>}
                                                >
                                                    <Typography>Other settings</Typography>
                                                </Tooltip>
                                                
                                            </ExpansionPanelSummary>
                                                <ExpansionPanelDetails>
                                                    <Box>
                                                    <Grid container>
                                                    <Typography variant='h6'>Complexity settings</Typography>
                                                </Grid>

                                                <Grid container spacing={3} justify="flex-start">
                                                    {/*<Grid item xs={6}>*/}
                                                    {/*    <RefSelect*/}
                                                    {/*        inputLabel={'Method'}*/}
                                                    {/*        selectNameId={'method'}*/}
                                                    {/*        selectValue={this.props.method}*/}
                                                    {/*        selectOptions={this.props.methods}*/}
                                                    {/*        disabledSelect={this.props.disabled_select_reference}*/}
                                                    {/*    />*/}
                                                    {/*</Grid>*/}

                                                    <Grid item xs={12}>
                                                        <RefSelect
                                                            inputLabel={'Window'}
                                                            selectNameId={'complexity_window'}
                                                            selectValue={this.props.complexity_window}
                                                            selectOptions={this.props.complexity_windows.list}
                                                            disabledSelect={this.props.disabled_select_reference}
                                                            tooltipText={<React.Fragment>
                                                                            <Typography variant='body2'>
                                                                            This parameter sets the region on the basis of which 
                                                                            the complexity value is calculated. The larger
                                                                             it is, the smoother the complexity profile.
                                                                            </Typography>
                                                                        </React.Fragment>}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                


                                                <Grid container justify="flex-start" spacing={3}>
                                                    <Grid item xs={6}>
                                                        <RefTextFields
                                                            labelTF={'Hotspots threshold'}
                                                            nameTF={'coef'}
                                                            valueTF={this.props.coef}
                                                            disTF={this.props.disabled_select_reference}
                                                            tooltipText={
                                                                <React.Fragment>
                                                                    <Typography variant='body2'>
                                                                    he coefficient by which the interquartile distance 
                                                                    is multiplied in the Tukey outlier criterion.
                                                                     The greater the value, the more stringent 
                                                                     hotspots are determined.
                                                                    </Typography>
                                                                </React.Fragment>
                                                            }
                                                        />
                                                    </Grid>

                                                    <Grid item xs={6}>
                                                        <FormControlLabel
                                                            disabled={this.props.disabled_select_reference}
                                                            control={
                                                                <Tooltip title={ <React.Fragment>
                                                                    <Typography variant='body2'>
                                                                    Highlight genes in complexity plot, with complexity values higher 
                                                                    than the threshold, according to the Tukey criterion.
                                                                    </Typography>
                                                                </React.Fragment>

                                                                }>
                                                                    <Switch name='show_hotspots'
                                                                            color="primary"
                                                                            value={this.props.show_hotspots}
                                                                            checked={this.props.show_hotspots}
                                                                            onChange={this.handleChange}
                                                                    />
                                                                </Tooltip>}
                                                            label="Show hotspots"
                                                        />
                                                    </Grid>
                                                </Grid>

                                                <Divider className={classes.divider}/>
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

                                                
                                                {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
                                                <Grid container spacing={3}>
                                                    <Grid item xs={6}>
                                                        <RefTextFields
                                                            labelTF={'Tails'}
                                                            nameTF={'tails'}
                                                            valueTF={this.props.tails}
                                                            typeTF={"number"}errTF={(this.props.tails < 0 || this.props.tails > 100)}
                                                            errTF={(this.props.tails < 0 || this.props.tails > 100)}
                                                            helperTextTF={(this.props.tails < 0 || this.props.tails > 100) ? '0 < tails <= 100 is available' : ''}
                                                            
                                                            tooltipText={<React.Fragment>
                                                                <Typography variant='body2'>
                                                                Paths in the graph which are longer than Depth are 
                                                                cropped to fragments of this value length
                                                                </Typography>
                                                            </React.Fragment>}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <RefTextFields
                                                            labelTF={'Depth'}
                                                            nameTF={'depth'}
                                                            valueTF={this.props.depth}
                                                            typeTF={"number"}
                                                            errTF={(this.props.depth < 2 || this.props.depth > 200)}
                                                            helperTextTF={(this.props.depth < 2 || this.props.depth > 200) ? '2 < depth <= 200 is available' : ''}
                                                            tooltipText={
                                                                <React.Fragment>
                                                                    <Typography variant='body2'>
                                                                    Do not show paths beginning and ending in the selected region longer than this value
                                                                    </Typography>
                                                                </React.Fragment>
                                                            }
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
                                                            tooltipText={<React.Fragment>
                                                                <Typography variant='body2'>
                                                                Hide edges in the graph with a weight (number of genomes) below this value
                                                                </Typography>
                                                            </React.Fragment>}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={6}>
                                                        <RefTextFields
                                                            labelTF={'Neighborhood'}
                                                            nameTF={'window'}
                                                            valueTF={this.props.window}
                                                            helperTextTF={(this.props.window < 1 || this.props.window > 100) ? '1 < neighborhood <= 100 is available' : ''}
                                                            typeTF={"number"}
                                                            tooltipText={<React.Fragment>
                                                                <Typography variant='body2'>
                                                                Add this number of genes left and right to the region shown
                                                                </Typography>
                                                            </React.Fragment>
                                                        }
                                                        />
                                                    </Grid>
                                                </Grid>


                                                <br></br>

                                                <Grid container spacing={6}>
                                                    <Grid item xs={6}>
                                                        <FormControl component="fieldset">
                                                            <FormLabel component="legend">Layouter</FormLabel>
                                                            <Tooltip title={<React.Fragment>
                                                                <Typography variant='body2'>
                                                                Use Dagre/Graphviz layout method to arrange nodes in the graph
                                                                </Typography>
                                                            </React.Fragment>}>
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
                                                                <Tooltip title={<React.Fragment>
                                                                    <Typography variant='body2'>
                                                                    Do not show edges pointing in the opposite direction from the major direction of the edges
                                                                    </Typography>
                                                                </React.Fragment>}>
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
                                                        <FormControlLabel
                                                            control={
                                                                <Tooltip title={<React.Fragment>
                                                                    <Typography variant='body2'>
                                                                        Orthologize and show paralogues genes
                                                                    </Typography>
                                                                </React.Fragment>}>
                                                                    <Switch name='pars'
                                                                        // value="checked"
                                                                            checked={this.props.pars}
                                                                            color="primary"
                                                                            onChange={this.handleChangePars}
                                                                    />
                                                                </Tooltip>
                                                            }
                                                            label="Draw paralogues"
                                                        />
                                                    </Grid>

                                                    

                                                </Grid>

                                                    </Box>
                                                

                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                        
                                    </Box>
                        </Container>
                    </Grid>
                </Grid>
            </div>
        );
    }

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

    // самописная проверка на вхождение элемена, не помню уже зачем
    isInArray = (array, element) => {
        for (let i = 0; i < array.length; i++) {
            if (element === array[i]) {
                return true;
            }
        }
        return false;
    };

    handleChangeExpPanel = () => {
        this.setState({expanded: !this.state.expanded});
    };

    handleDraw = () => {
        document.getElementById('graphButtonDraw').click();
    };
}

const connectRef = connect(mapStateToProps, actionCreators)(ReferenceParametersExpansionPanel);

export default withStyles(useStyles)(connectRef);

