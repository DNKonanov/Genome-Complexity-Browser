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
    Typography
} from '@material-ui/core';

class EdgeDescription extends Component {
    // просто компонент с табличкой по данным из пропсов

    render() {
        return (
            <Grid>
                <Typography align="center" variant='h6'>List of genomes</Typography>
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