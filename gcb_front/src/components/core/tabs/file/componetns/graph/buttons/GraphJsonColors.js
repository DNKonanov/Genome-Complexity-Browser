import React from "react";
import {useStyles} from "../../../../parameters/style/SelectParametersStyle";
import BackupRoundedIcon from "@material-ui/icons/BackupRounded";
import CloudDownloadRoundedIcon from "@material-ui/icons/CloudDownloadRounded";
import {Button, Container, Grid, Tooltip, withStyles,
    ButtonGroup,CardContent,Card
} from '@material-ui/core';
class GraphJsonColors extends React.Component {

    handleDownloadJSON = () => {
        document.getElementById('Download_json_graph').click();

    };

    handleDownloadJPG = () => {
        document.getElementById('Download_JPG').click();

    };

    handleUploadColors = () => {
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
                                        <Tooltip title="helper">
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

                                        <Tooltip title="helper">
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

                                        <Tooltip title="helper">
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