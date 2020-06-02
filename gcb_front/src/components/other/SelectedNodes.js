import React, {Component} from 'react';

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


class SelectedNodes extends Component {

    // просто табличка с данными из пропсов

    render() {
        return (
            <Grid>
                <Typography align="center" variant='h6'>Nodes description</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>OG</TableCell>
                                <TableCell>Gene description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.selected_nodes.split('\n').map(
                                node => {
                                    return (
                                        <TableRow key={node}>
                                            {node.split('\t').map(txt => {
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

export default SelectedNodes;