import React from "react";
import {connect} from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import {useStyles} from "../../style/SelectParametersStyle";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import CloudDownloadRoundedIcon from "@material-ui/icons/CloudDownloadRounded";
import BackupRoundedIcon from "@material-ui/icons/BackupRounded";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {
    setEnabled_Show_Delete_User_Coordinates,
    setUserCoordinatesStr
} from "../../../../../../redux/actions/file/readFile";
import {ENABLED_SHOW_DELETE_USER_COORDINATES} from "../../../../../../redux/constants/file/constants";


const mapStateToProps = state => ({
    userCoordinatesStr: state.file.userCoordinatesStr,
    complexity: state.reference.complexity,
    org: state.requisite.org,
    stamm: state.requisite.stamm,
    contig: state.requisite.contig,
    method: state.requisite.method,

});

const actionCreator = {
    setUserCoordinatesStr: setUserCoordinatesStr,
    setEnabled_Show_Delete_User_Coordinates: setEnabled_Show_Delete_User_Coordinates
};

class ComplexityPlotButtonFile extends React.Component {
    // открыте файла с клиента
    inputFileChanged = (e) => {
        if (window.FileReader) {
            let file = e.target.files[0], reader = new FileReader();
            reader.onload = function (r) {
                this.props.setUserCoordinatesStr(r.target.result);
                this.props.setEnabled_Show_Delete_User_Coordinates( true);
            }.bind(this);
            reader.readAsText(file);
        } else {
            alert('Sorry, your browser does\'nt support for preview');
        }
        e.preventDefault()
    };

    // грузит файл с профилем сложности
    downloadData = (e) => {
        let data =
            'organism=' + this.props.org +
            '\tgenome=' + this.props.stamm +
            '\tcontig=' + this.props.contig +
            '\tmethod=' + this.props.method + '\n';

        data = data + 'position\tcomplexity\n';

        for (let i = 0; i < this.props.complexity.coord_list.length; i++) {
            data =
                data
                + this.props.complexity.coord_list[i] + '\t'
                + this.props.complexity.complexity[i] + '\n'
        }

        let element = document.createElement("a");
        let file = new Blob([data], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = this.props.contig + ".txt";
        element.click();
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Container fixed className={classes.boxButtons}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <Button size="large"
                                            variant="contained"
                                            color="secondary"
                                    >
                                        DRAW GRAPH
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} justify="flex-end" alignItems="stretch">
                                <Grid item xs={6}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="label"
                                        fullWidth
                                        startIcon={<BackupRoundedIcon/>}
                                    >
                                        Load file
                                        <input
                                            onChange={(e) => {
                                                this.inputFileChanged(e)
                                            }}
                                            style={{display: 'none'}}
                                            type="file"
                                        />
                                    </Button>
                                </Grid>

                                <Grid item xs={6}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="label"
                                        fullWidth
                                        startIcon={<CloudDownloadRoundedIcon/>}
                                        onClick={(e) => {
                                            this.downloadData(e)
                                        }}
                                    >
                                        Download data
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Container>
            </div>
        );
    }

}

const connectSelectParameters = connect(mapStateToProps, actionCreator)(ComplexityPlotButtonFile);
export default withStyles(useStyles)(connectSelectParameters);