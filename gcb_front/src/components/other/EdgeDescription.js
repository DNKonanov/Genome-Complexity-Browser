import React, {Component} from 'react';
//import 'JSON';
import {
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Tooltip
} from '@material-ui/core';

class EdgeDescription extends Component {
    // просто компонент с табличкой по данным из пропсов

    render() {
        return (
            <Grid>
                <Tooltip
                    title={<React.Fragment>
                        <Typography variant='body2'>
                        Genomes from the selected edge of the graph
                        </Typography>
                    </React.Fragment>}
                    >
                        <Typography align="center" variant='h6'>List of genomes</Typography>
                    </Tooltip>
                
                <TableContainer component={Paper}>
                    <Table>

                        <TableHead>
                            <TableRow>
                                <TableCell>Reference code</TableCell>
                                <TableCell>Reference name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.edge_description.split('\n').map(
                                edge => {
                                    return (
                                        <TableRow key={edge}>
                                            {edge.split('\t').map(txt => {
                                                return (
                                                    <TableCell key={txt}>{txt}</TableCell>
                                                )
                                            })}
                                        </TableRow>
                                    )
                                }
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        )
    }
}

export default EdgeDescription;