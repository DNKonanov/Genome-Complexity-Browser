import React, {Component} from 'react';
import '../../App.css';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Grid, Typography} from '@material-ui/core';


class SelectedNodes extends Component {

    // просто табличка с данными из пропсов

    render() {
        return (
            <Grid>
                <Typography align="center" variant='h6'>Nodes description</Typography>

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
            </Grid>

        )
    }
}

export default SelectedNodes;