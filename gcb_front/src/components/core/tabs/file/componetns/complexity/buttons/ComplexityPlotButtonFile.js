import React from "react";
import {connect} from "react-redux";
import {useStyles} from "../../../../parameters/style/SelectParametersStyle";
import CloudDownloadRoundedIcon from "@material-ui/icons/CloudDownloadRounded";
import {
    setEnabled_Show_Delete_User_Coordinates,
    setUserCoordinatesStr
} from "../../../../../../../redux/actions/file/readFile";
import {Button, Container, Grid, Tooltip, withStyles, Typography} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
    
    state = {
        BED: false,
    }

    handleChange = (e) => {
        console.log(e.target.checked)
        this.setState({
            BED: e.target.checked
        })
    }


    downloadData = (e) => {

        if (this.state.BED) {
            this.downloadBEDData(e)
        }
        else {
            this.downloadTXTData(e)
        }
    }

    downloadBEDData = (e) => {
        let data = ''
        console.log(this.props.complexity)
        for (let i = 0; i < this.props.complexity.coord_list.length; i++) {
            
            if (this.props.complexity.hotspots_sym[i] === '+') {
                
                let length = this.props.complexity.length_list[i] 
                let start = this.props.complexity.coord_list[i] - Math.floor(length/2)
                let end = start + length
                
                data = data +
                this.props.contig + '\t' +
                start + '\t' +
                end + '\t' +'val=' +
                this.props.complexity.complexity[i] + '\n'

            }

            
        }

        let element = document.createElement("a");
        let file = new Blob([data], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = this.props.contig + ".bed";
        element.click();
    }

    // грузит файл с профилем сложности
    downloadTXTData = (e) => {
        let data =
            'organism=' + this.props.org +
            '\tgenome=' + this.props.stamm +
            '\tcontig=' + this.props.contig + '\n';

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
                            <Tooltip 
                                title={<React.Fragment>
                                    <Typography variant='body2'>
                                    Download tab-delimited file with gene coordinates, complexity values, 
                                    and hotspot inforamation (marked with +)
                                    </Typography>
                                </React.Fragment>}
                                aria-label="add">
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


                            <Tooltip 
                                title={<React.Fragment>
                                    <Typography variant='body2'>
                                    Use BED format
                                    </Typography>
                                </React.Fragment>}
                                aria-label="add">
                                <FormControlLabel
                                    control={<Checkbox 
                                        name="BEDcheckbox"
                                        
                                        />}
                                    label="Use BED format"
                                    onChange={e => this.handleChange(e)}
                                />
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