import React, {Component} from 'react';
//import 'JSON';
import '../../App.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Grid, Typography} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";

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