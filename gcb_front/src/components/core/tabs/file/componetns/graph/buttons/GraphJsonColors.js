import React from "react";
import {useStyles} from "../../../../parameters/style/SelectParametersStyle";
import BackupRoundedIcon from "@material-ui/icons/BackupRounded";
import CloudDownloadRoundedIcon from "@material-ui/icons/CloudDownloadRounded";
import {Button, Container, Grid, Tooltip, withStyles,Typography} from '@material-ui/core';
class GraphJsonColors extends React.Component {

    handleDownloadJSON = () => {
        let el = document.getElementById('Download_JPG')
        if (el === null) {
            alert('There is no graph to save! Please, select region of interest and use DRAW GRAPH button')
            return
        }
        document.getElementById('Download_json_graph').click();

    };

    handleDownloadJPG = () => {
        let el = document.getElementById('Download_JPG')
        if (el === null) {
            alert('There is no graph to save! Please, select region of interest and use DRAW GRAPH button')
            return
        }
        document.getElementById('Download_JPG').click();

    };

    handleUploadColors = () => {
        let el = document.getElementById('Download_JPG')
        if (el === null) {
            alert('There is no graph to upload colors! Please, select region of interest and use DRAW GRAPH button')
            return
        }
        document.getElementById('Upload_colors').click();

    };


    render() {
        const {classes} = this.props;
        return (
            <div>
                <Container fixed className={classes.boxButtons}>
                            <Grid container
                                  spacing={1}
                                  justify="center"

                                // alignItems="stretch"
                            >
                                <Grid item xs={12}>
                                        <Tooltip title={<React.Fragment>
                                            <Typography variant='body2'>
                                            Download JSON file with graph data (including layout). Can be imported into Cytoscape.
                                            </Typography>
                                        </React.Fragment>
                                        }>
                                            <Button
                                                variant="outlined"
                                                color="default"
                                                component="label"
                                                fullWidth
                                                disableElevation
                                                startIcon={<CloudDownloadRoundedIcon/>}
                                                onClick={this.handleDownloadJSON}
                                            >
                                                DOWNLOAD JSON
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Tooltip title={<React.Fragment>
                                            <Typography variant='body2'>
                                            Download the contents of the Graph panel to the jpeg file
                                            </Typography>
                                        </React.Fragment>}>
                                            <Button
                                                variant="outlined"
                                                color="default"
                                                component="label"
                                                fullWidth
                                                disableElevation

                                                onClick={this.handleDownloadJPG}
                                                startIcon={<CloudDownloadRoundedIcon/>}
                                            >
                                                DOWNLOAD JPG
                                            </Button>
                                        </Tooltip>
                                    </Grid>

                                    <Grid item xs={12}>
                                        

                                        <Tooltip title={<React.Fragment>
                                            <Typography variant='body2'>
                                            Upload a file containing the colors for the nodes you want to highlight. 
                                            File fomat: <br></br><br></br>
                                            &lt;node_id1&gt; &lt;color1&gt;<br></br>
                                            &lt;node_id2&gt; &lt;color2&gt;<br></br>
                                            ...<br></br>
                                             (e.g., OG0007946 #0000FF), 
                                            with each node starting from a newline
                                            </Typography>
                                        </React.Fragment>}>
                                            <Button
                                                variant="outlined"
                                                color="default"
                                                component="label"
                                                fullWidth
                                                disableElevation
                                                onClick={this.handleUploadColors}
                                                startIcon={<BackupRoundedIcon/>}
                                            >
                                                UPLOAD COLORS
                                            </Button>
                                        </Tooltip>
                                </Grid>
                            </Grid>
                </Container>
            </div>
        );
    }
}

export default withStyles(useStyles)(GraphJsonColors);