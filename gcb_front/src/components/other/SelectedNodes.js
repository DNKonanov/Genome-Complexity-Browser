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
    Tooltip,
    Typography
} from '@material-ui/core';


class SelectedNodes extends Component {

    // просто табличка с данными из пропсов

    render() {
        return (
            <Grid>
                <Tooltip
                    title={<React.Fragment>
                        <Typography variant='body2'>
                        Information about selected genes
                        </Typography>
                    </React.Fragment>}
                >
                    <Typography align="center" variant='h6'>Nodes description</Typography>
                </Tooltip>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>OrthologyGroup ID</TableCell>
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