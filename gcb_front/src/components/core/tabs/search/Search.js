import React from "react";
import Box from "@material-ui/core/Box";
import {Card, ExpansionPanel} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import {SERVER_PORT, SERVER_URL} from "../../../../redux/constants/urls";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import TableContainer from "@material-ui/core/TableContainer";
import {withStyles} from "@material-ui/core/es";
import Divider from "@material-ui/core/Divider";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
    loadGenName,
    setCoordStartCoordEnd,
    setRequisite,
    setValueForSearch
} from "../../../../redux/actions/selector/actions";
import {connect} from 'react-redux';
import {SEARCH_RESULTS} from "../../../../redux/constants/selector/constants";
import Paper from "@material-ui/core/Paper";

const mapStateToProps = state => ({
    org: state.requisite.org,
    stamm: state.requisite.stamm,
    pars: state.requisite.pars,

    search_query: state.requisite.search_query,
    search_results: state.requisite.search_results,

    prevOrgSearch: state.requisite.prevOrgSearch,
    prevStammSearch: state.requisite.prevStammSearch,
    prevParsSearch: state.requisite.prevParsSearch,

});

const actionsCreator = {
    loadGenName: loadGenName,
    setCoordStartCoordEnd: setCoordStartCoordEnd,
    setRequisite: setRequisite,

    setValueForSearch: setValueForSearch,
};

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search_query_value: '',
            search_results: [],
        }
    }

    componentDidMount() {
        if (this.props.search_query.length === 0) {
            this.loadGenName();
            this.setValueForSearch();
        } else if (
            this.props.org !== this.props.prevOrgSearch ||
            this.props.stamm !== this.props.prevStammSearch ||
            this.props.pars !== this.props.prevParsSearch
        ) {
            this.loadGenName();
            this.setValueForSearch();
        }
    }

    loadGenName = () => {
        this.props.loadGenName(
            this.props.org,
            this.props.stamm,
            this.props.pars,
        );
    };

    setValueForSearch = () => {
        this.props.setValueForSearch(
            this.props.org,
            this.props.stamm,
            this.props.pars,
        )
    };

    search = (e) => {
        let url = SERVER_URL + SERVER_PORT + '/search/org/'
            + this.props.org + '/strain/'
            + this.props.stamm + '/pars/'
            + this.props.pars + '/input/'
            + this.state.search_query_value + '/';

        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.props.setRequisite(SEARCH_RESULTS, data);
            })
            .catch(error => console.log('error'));

        e.preventDefault()
    };

    clearSearchResults = (e) => {
        this.props.setRequisite(SEARCH_RESULTS, []);
    };

    handleChange = (event, newValue) => {
        console.log(newValue);
        this.setState({search_query_value: newValue})
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                        <Container
                        >
                            <Box>
                                <Card className={this.props.cardInDrawer}>
                                    <CardContent>
                                        <form onSubmit={this.search}>
                                            <Grid container spacing={1} justify="center">
                                                <Grid item xs={10}>
                                                    <Autocomplete
                                                        id="combo-box-demo"
                                                        options={this.props.search_query}
                                                        getOptionLabel={(option) => option.toString()}
                                                        loading={this.props.search_query.length === 0}
                                                        value={this.state.search_query_value}
                                                        onChange={this.handleChange}

                                            inputValue={this.state.search_query_value}
                                            onInputChange={this.handleChange}

                                            renderInput={(params) => (
                                                <TextField {...params}
                                                           label="Search"
                                                           variant="outlined"
                                                           fullWidth
                                                           name='search_query'
                                                />)
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={1}>
                                        <IconButton
                                            type="submit"
                                            onClick={this.search}
                                        >
                                            <SearchIcon/>
                                        </IconButton>
                                    </Grid>

                                                <Grid item xs={1}>
                                                    <IconButton
                                                        onClick={this.clearSearchResults}
                                                    >
                                                        <ClearIcon/>
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Container>
                    </Grid>
                </Grid>

                <Divider className={classes.divider}
                         style={this.props.search_results.length === 0 ? {display: 'none'} : {display: ''}}/>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Container
                            // fixed
                            maxWidth="xl"
                        >

                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                    <Typography>RESULT</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <TableContainer component={Paper}>
                                        <Table className={classes.table}
                                               size="small"
                                               aria-label="a dense table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>OG</TableCell>
                                                    <TableCell>Gene description</TableCell>
                                                    <TableCell>Position</TableCell>
                                                    <TableCell>Jump to</TableCell>
                                                    <TableCell>Contig</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {this.props.search_results.map(
                                                    result => {
                                                        return (
                                                            <TableRow key={result[0]}>
                                                                <TableCell>{result[0]}</TableCell>
                                                                <TableCell>{result[1]}</TableCell>
                                                                <TableCell>{result[2]}</TableCell>
                                                                <TableCell>

                                                                    <button
                                                                        value={result[2]}
                                                                        onClick={(e) => {
                                                                            this.props.setCoordStartCoordEnd(
                                                                                e.target.value,
                                                                                e.target.value
                                                                            );
                                                                        }}
                                                                    >
                                                                        {result[2]}
                                                                    </button>
                                                                </TableCell>
                                                                <TableCell>{result[3]}</TableCell>
                                                            </TableRow>
                                                        )
                                                    }
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </Container>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const useStyle = theme => ({
    table: {
        minWidth: 650,
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
});
const connectClass = connect(mapStateToProps, actionsCreator)(Search);
export default withStyles(useStyle)(connectClass);