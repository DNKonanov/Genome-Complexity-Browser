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

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search_query: '',
            search_results: [],
        }
    }

    search = (e) => {
        let url = SERVER_URL + SERVER_PORT + '/search/org/' + this.state.org + '/strain/' + this.state.stamm + '/pars/' + this.state.pars + '/input/' + this.state.search_query + '/'
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.setState({search_results: data})
            })
            .catch(error => console.log('error'));

        e.preventDefault()
    };

    clearSearchResults = (e) => {
        this.setState({
                search_results: []
            }
        )
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
                                        <form onSubmit={this.search}>
                                            <Grid container spacing={1} justify="center">
                                                <Grid item xs={10}>
                                                    <TextField label={'Search'}
                                                               fullWidth
                                                               name='search_query'
                                                               value={this.state.search_query}
                                                               onChange={this.handleChange}
                                                               helperText={this.state.search_query === '' ? 'Enter text' : 'There are not result to show'}
                                                    />
                                                </Grid>

                                                <Grid item xs={1}>
                                                    <IconButton
                                                        type="submit"
                                                        onClick={(e) => {
                                                            this.search(e)
                                                        }}
                                                    >
                                                        <SearchIcon/>
                                                    </IconButton>
                                                </Grid>

                                                <Grid item xs={1}>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            this.clearSearchResults(e)
                                                        }}
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
                         style={this.state.search_results.length === 0 ? {display: 'none'} : {display: ''}}/>

                <Grid container spacing={3}
                      // style={this.state.search_results.length === 0 ? {display: 'none'} : {display: ''}}
                    >
                    <Grid item xs={12}>
                        <Container fixed>
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                    <Typography>RESULT</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Box>
                                        <Card>
                                            <CardContent>
                                                <TableContainer>
                                                    <Table className={classes.table}>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>OG</TableCell>
                                                                <TableCell>Gene description</TableCell>
                                                                <TableCell>Position</TableCell>
                                                                <TableCell>Contig</TableCell>
                                                            </TableRow>
                                                        </TableHead>

                                                        <TableBody>
                                                            {this.state.search_results.map(
                                                                result => {
                                                                    return (
                                                                        <TableRow key={result[0]}>
                                                                            <TableCell>{result[0]}</TableCell>
                                                                            <TableCell>{result[1]}</TableCell>
                                                                            <TableCell>

                                                                                <button
                                                                                    value={result[2]}
                                                                                    onClick={(e) => {
                                                                                        this.setState({
                                                                                            coord_start: e.target.value,
                                                                                            coord_end: e.target.value
                                                                                        })
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
                                            </CardContent>
                                        </Card>
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

const useStyle = theme => ({
    table: {
        minWidth: 450,
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
});
export default withStyles(useStyle)(Search);