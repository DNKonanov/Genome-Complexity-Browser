import React from "react";
import {connect} from 'react-redux';
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import {ExpansionPanel} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import withStyles from "@material-ui/core/styles/withStyles";
import {useStyles} from "../../../../style/SelectParametersStyle";
import {
    fetchComplexity,
    fetchContigs,
    fetchOrganisms,
    fetchStammsForOrg,
    fetchWindows,
    putSelectedRef
} from "../../../../../../../../redux/actions/referenceActions";

import {setRequisite} from "../../../../../../../../redux/actions/selector/actions";

import {
    CONTIG,
    COORD_END,
    COORD_START,
    GENOME_NAME,
    OG_END_S,
    OG_START_S,
    STAMM
} from "../../../../../../../../redux/constants/selector/constants";

import RefSelect from "../components/RefSelect";
import RefTextFields from "../components/RefTextFields";
import Button from "@material-ui/core/Button";
import removeAllTips from "../../../../../../../../sctipts/helper/functions/removeAllTips";


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

    search_query: state.requisite.search_query,
    search_results: state.requisite.search_results,

    // componentsProps
    disabled_select_reference: state.components.select.disabled_select_reference
});
const actionCreators = {
    fetchOrganisms: fetchOrganisms,
    fetchContigs: fetchContigs,
    fetchWindows: fetchWindows,
    fetchStammsForOrg: fetchStammsForOrg,
    fetchComplexity: fetchComplexity,
    putSelectedRef: putSelectedRef,
    //requisite
    setRequisite: setRequisite,
};

class ReferenceParametersExpansionPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
        };
    };

    componentDidMount() {
        if (this.props.organisms.length === 0)
            this.props.fetchOrganisms();
        return;
    };

    // обновление стейта в общем виде
    handleChange =  (e) => {
        e.preventDefault();
        this.props.setRequisite(e.target.name.toUpperCase(), e.target.value);
    };

    componentDidUpdate(prevProps, prevState) {

        removeAllTips();
        if (this.props.organisms.length > 0) {// This means we succesfully loaded list of organisms
            if (this.props.stamms.org !== this.props.org) { //Stamms for selected organims are not loaded
                this.props.fetchStammsForOrg(this.props.org);
                return;
            } else { // stamms loaded
                if (!this.isInArray(this.props.stamms.list, this.props.stamm)) { //selected stamm is not from list
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
                                    comp_par.pars !== this.props.pars || comp_par.complexity_window !== this.props.complexity_window) {

                                    this.props.fetchComplexity(
                                        this.props.org,
                                        this.props.stamm,
                                        this.props.contig,
                                        this.props.method,
                                        this.props.pars,
                                        this.props.complexity_window
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
                                                this.props.setRequisite(OG_END_S, this.props.complexity.OGs[close_end_gene]);
                                                this.props.setRequisite(OG_START_S, this.props.complexity.OGs[close_st_gene]);
                                                this.props.putSelectedRef(this.props.org, this.props.stamm, this.props.contig,
                                                    this.props.complexity.OGs[close_st_gene], this.props.complexity.OGs[close_end_gene], this.props.method, this.props.pars, this.props.operons, this.props.complexity_window)
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
        return (
            <div>
                <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                        <Container fixed>
                            <ExpansionPanel expanded={this.state.expanded}
                                            onChange={this.handleChangeExpPanel}
                            >
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                    <Typography>Reference Parameters</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Box>
                                        <Grid container justify="center">
                                            <Typography variant='h5'>Reference parameters</Typography>
                                        </Grid>
                                        <Divider className={classes.divider}/>

                                        <Grid container
                                              justify="center"
                                              spacing={1}
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
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <RefSelect
                                                    inputLabel={'Reference'}
                                                    selectNameId={'stamm'}
                                                    selectValue={this.props.stamm}
                                                    selectOptions={this.props.stamms.list} // arr
                                                    disabledSelect={this.props.disabled_select_reference}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <RefSelect
                                                    inputLabel={'Contig'}
                                                    selectNameId={'contig'}
                                                    selectValue={this.props.contig}
                                                    selectOptions={this.props.contigs.list} //arr
                                                    disabledSelect={this.props.disabled_select_reference}
                                                />
                                            </Grid>
                                        </Grid>
                                        {/*-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
                                        <Divider className={classes.divider}/>

                                        <Grid container spacing={1} justify="center">
                                            <Grid item xs={6}>
                                                <RefSelect
                                                    inputLabel={'Method'}
                                                    selectNameId={'method'}
                                                    selectValue={this.props.method}
                                                    selectOptions={this.props.methods}
                                                    disabledSelect={this.props.disabled_select_reference}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RefSelect
                                                    inputLabel={'Window'}
                                                    selectNameId={'complexity_window'}
                                                    selectValue={this.props.complexity_window}
                                                    selectOptions={this.props.complexity_windows.list}
                                                    disabledSelect={this.props.disabled_select_reference}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Divider className={classes.divider}/>

                                        {/*TEXT FIELDS*/}
                                        <Grid container spacing={3}>
                                            <Grid item xs={6}>
                                                <RefTextFields
                                                    labelTF={'Start coordinate'}
                                                    nameTF={'coord_start'}
                                                    valueTF={this.props.coord_start}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <RefTextFields
                                                    labelTF={'End coordinate'}
                                                    nameTF={'coord_end'}
                                                    valueTF={this.props.coord_end}
                                                />
                                            </Grid>
                                        </Grid>


                                        <Divider className={classes.divider}/>
                                        {/*BUTTONS*/}
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <Button
                                                    fullWidth
                                                    color='primary'
                                                    variant='outlined'
                                                    onClick={(e) => {
                                                        this.checkOGs(e)
                                                    }}
                                                    disabled={this.props.disabled_select_reference}
                                                >
                                                    Update genes
                                                </Button>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Button
                                                    fullWidth
                                                    color='primary'
                                                    variant='outlined'
                                                    onClick={(e) => {
                                                        this.checkCoord(e)
                                                    }}
                                                    disabled={this.props.disabled_select_reference}
                                                >
                                                    Update coordinates
                                                </Button>
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
            this.props.setRequisite(OG_END_S, this.props.complexity.OGs[close_end_gene]);
            this.props.setRequisite(OG_START_S, this.props.complexity.OGs[close_st_gene]);
        }
    };

    checkCoord = (event) => {
        let coord_start = -1;
        let coord_end = -1;

        for (let i = 0; i < this.props.complexity.OGs.length; i++) {
            if (this.props.complexity.OGs[i] === this.props.og_start_s) {
                coord_start = this.props.complexity.coord_list[i]
            }
            if (this.props.complexity.OGs[i] === this.props.og_end_s) {
                coord_end = this.props.complexity.coord_list[i]
            }
        }

        if (coord_start === -1) {
            alert('Start OG is not in chosed genome!')
        } else if (coord_end === -1) {
            alert('Eng OG is not in chosed genome!')
        }

        if (coord_start !== -1 && coord_end !== -1) {
            this.props.setRequisite(COORD_START, coord_start);
            this.props.setRequisite(COORD_END, coord_end);
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
}

const connectRef = connect(mapStateToProps, actionCreators)(ReferenceParametersExpansionPanel);

export default withStyles(useStyles)(connectRef);
