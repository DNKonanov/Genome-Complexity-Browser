import React from "react";
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import {connect} from "react-redux";
import BackupRoundedIcon from "@material-ui/icons/BackupRounded";
import {useStyles} from "../../../../parameters/style/SelectParametersStyle";
import {
    setEnabled_Show_Delete_User_Coordinates,
    setMaxUserValue,
    setUserCoordinates,
    setUserCoordinatesStr,
    setUserValues
} from "../../../../../../../redux/actions/file/readFile";

import {Button, Container, Grid, Tooltip, withStyles, Typography} from '@material-ui/core';

const mapStateToProps = state => ({
    userCoordinatesStr: state.file.userCoordinatesStr,

    is_Load_User_Coordinates: state.file.is_Load_User_Coordinates,
    enabled_Show_Delete_User_Coordinates: state.file.enabled_Show_Delete_User_Coordinates,
});

const actionsCreator = {
    setUserCoordinates: setUserCoordinates,
    setUserValues: setUserValues,
    setMaxUserValue: setMaxUserValue,
    setUserCoordinatesStr: setUserCoordinatesStr,

    setEnabled_Show_Delete_User_Coordinates: setEnabled_Show_Delete_User_Coordinates
    
};


class ComplexityPlotButtonUserCoordinates extends React.Component {

    // открыте файла с клиента
    inputFileChanged = (e) => {
        if (window.FileReader) {
            let file = e.target.files[0], reader = new FileReader();
            reader.onload = function (r) {
                this.props.setUserCoordinatesStr(r.target.result);
                this.props.setEnabled_Show_Delete_User_Coordinates(true);
            }.bind(this);
            reader.readAsText(file);
        } else {
            alert('Sorry, your browser does\'nt support for preview');
        }
        e.preventDefault()
    };

    // загружает пользовательские координаты
    drawUserCoordinates = (e) => {
        if (this.props.userCoordinatesStr.length !== 0) {

            let string = this.props.userCoordinatesStr;
            let lines;
            lines = string.split('\n');

            this.props.setUserCoordinates([]);

            let coord = [];
            let values = [];
            let max_coord = -Infinity;

            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].replace(' ', '\t').split('\t');
                coord.push(parseInt(line[0], 10));

                let v = parseFloat(line[1]);
                if (v > max_coord) {
                    max_coord = v
                }
                values.push(-v)
            }

            this.props.setUserCoordinates(coord);
            this.props.setUserValues(values);
            this.props.setMaxUserValue(max_coord);
        }
        e.preventDefault()
    };

    // удаляет отрисовванные координаты
    deleteUserCoordinates = (e) => {
        e.preventDefault();
        this.props.setEnabled_Show_Delete_User_Coordinates(false);
        this.props.setUserCoordinates([]);
        this.props.setUserCoordinatesStr('');
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Container fixed className={classes.boxButtons}>
                    {/*<Card>*/}
                    {/*    <CardContent>*/}

                    <Grid container spacing={2} justify="center">


                        <Grid item xs={12}>
                            <Tooltip 
                                title={<React.Fragment>
                                    <Typography variant='body2'>
                                    Select a file containing the genome coordinates to highlight. 
                                    Format: 

                                    <br></br>
                                    <br></br>&lt;genome position 1&gt; &lt;numeric value 1&gt;.
                                    <br></br>&lt;genome position 2&gt; &lt;numeric value 2&gt;.
                                    <br></br>...
                                    </Typography>
                                </React.Fragment>}
                                aria-label="add">
                                <Button
                                    variant="outlined"
                                    color="default"
                                    component="label"
                                    fullWidth
                                    disableElevation
                                    startIcon={<BackupRoundedIcon/>}
                                >
                                    Upload user features file
                                    <input
                                        onChange={(e) => {
                                            this.inputFileChanged(e)
                                        }}
                                        style={{display: 'none'}}
                                        type="file"
                                    />
                                </Button>
                            </Tooltip>
                        </Grid>
                        </Grid>
                        <Grid container spacing={2} justify="center">
                        <Grid item xs={6}>
                        <Tooltip 
                                title={<React.Fragment>
                                    <Typography variant='body2'>
                                    Show uploaded features on the complexity plot, you can select type of plot below.                                    </Typography>
                                </React.Fragment>} 
                                aria-label="add">
                            <Button
                                variant="outlined"
                                color="default"
                                component="label"
                                fullWidth
                                disableElevation
                                startIcon={<VisibilityIcon/>}
                                onClick={this.drawUserCoordinates}
                                // disabled={}
                            >
                                Show features
                            </Button>
                            </Tooltip>
                        </Grid>

                        <Grid item xs={6}>
                            <Tooltip 
                                title={<React.Fragment>
                                    <Typography variant='body2'>
                                    Remove uploaded features from plot and memory.
                                    </Typography>
                                </React.Fragment>} 
                                aria-label="add">
                            <Button
                                variant="outlined"
                                color="default"
                                component="label"
                                fullWidth
                                disableElevation
                                startIcon={<DeleteForeverRoundedIcon/>}
                                onClick={this.deleteUserCoordinates}
                                // disabled={!this.props.enabled_Show_Delete_User_Coordinates}
                            >
                                Remove features
                            </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }

}

const connectSelectParameters = connect(mapStateToProps, actionsCreator)(ComplexityPlotButtonUserCoordinates);
export default withStyles(useStyles)(connectSelectParameters);