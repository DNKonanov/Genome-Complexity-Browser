import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {useStyles} from "../../../../parameters/style/SelectParametersStyle";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import BackupRoundedIcon from "@material-ui/icons/BackupRounded";
import CloudDownloadRoundedIcon from "@material-ui/icons/CloudDownloadRounded";
import Container from "@material-ui/core/Container";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Tooltip from "@material-ui/core/Tooltip";

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
                    <Card>
                        <CardContent>
                            <Grid container
                                  spacing={3}
                                  justify="center"
                                // alignItems="stretch"
                            >
                                <Grid item xs={6}>
                                    <ButtonGroup
                                        aria-label="outlined button group"
                                        orientation="vertical"
                                    >
                                        <Tooltip title="helper">
                                            <Button
                                                startIcon={<CloudDownloadRoundedIcon/>}
                                                onClick={this.handleDownloadJSON}
                                            >
                                                DOWNLOAD JSON
                                            </Button>
                                        </Tooltip>

                                        <Tooltip title="helper">
                                            <Button
                                                onClick={this.handleDownloadJPG}
                                                startIcon={<CloudDownloadRoundedIcon/>}
                                            >
                                                DOWNLOAD JPG
                                            </Button>
                                        </Tooltip>

                                        <Tooltip title="helper">
                                            <Button
                                                onClick={this.handleUploadColors}
                                                startIcon={<BackupRoundedIcon/>}
                                            >
                                                UPLOAD COLORS
                                            </Button>
                                        </Tooltip>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Container>
            </div>
        );
    }
}

export default withStyles(useStyles)(GraphJsonColors);