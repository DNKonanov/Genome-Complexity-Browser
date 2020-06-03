import React from "react";
import {connect} from "react-redux";
import {useStyles} from "../../../../parameters/style/SelectParametersStyle";
import CloudDownloadRoundedIcon from "@material-ui/icons/CloudDownloadRounded";
import BackupRoundedIcon from "@material-ui/icons/BackupRounded";
import {
    setEnabled_Show_Delete_User_Coordinates,
    setUserCoordinatesStr
} from "../../../../../../../redux/actions/file/readFile";
import {Button, Container, Grid, Tooltip, withStyles} from '@material-ui/core';


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
    

    // грузит файл с профилем сложности
    downloadData = (e) => {
        let data =
            'organism=' + this.props.org +
            '\tgenome=' + this.props.stamm +
            '\tcontig=' + this.props.contig +
            '\tmethod=' + this.props.method + '\n';

        data = data + 'position\tOrthoGroupID\tcomplexity\thotspot\n';

        for (let i = 0; i < this.props.complexity.coord_list.length; i++) {
            data = data +
                this.props.complexity.coord_list[i] + '\t' +
                this.props.complexity.OGs[i] + '\t' +
                this.props.complexity.complexity[i] + '\t' +
                this.props.complexity.hotspots_sym[i] + '\n'
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
                    <Grid container spacing={1} justify="center">

                        <Grid item xs={12}>
                            <Tooltip title="helper" aria-label="add">
                                <Button
                                    variant="outlined"
                                    color="default"
                                    component="label"
                                    fullWidth
                                    disableElevation
                                    startIcon={<CloudDownloadRoundedIcon/>}
                                    onClick={(e) => {
                                        this.downloadData(e)
                                    }}
                                >
                                    Download complexity values
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }

}

const connectSelectParameters = connect(mapStateToProps, actionCreator)(ComplexityPlotButtonFile);
export default withStyles(useStyles)(connectSelectParameters);