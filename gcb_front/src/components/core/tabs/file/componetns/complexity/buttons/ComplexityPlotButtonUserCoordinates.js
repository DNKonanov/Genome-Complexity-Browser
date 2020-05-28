import React from "react";
import {connect} from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import {useStyles} from "../../../../parameters/style/SelectParametersStyle";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';

import {
    setUserCoordinates,
    setUserValues,
    setMaxUserValue,
    setUserCoordinatesStr, setEnabled_Show_Delete_User_Coordinates
}
    from "../../../../../../../redux/actions/file/readFile";

const mapStateToProps = state => ({
    userCoordinatesStr: state.file.userCoordinatesStr,

    is_Load_User_Coordinates:state.file.is_Load_User_Coordinates,
    enabled_Show_Delete_User_Coordinates:state.file.enabled_Show_Delete_User_Coordinates,
});

const actionsCreator = {
    setUserCoordinates: setUserCoordinates,
    setUserValues: setUserValues,
    setMaxUserValue:setMaxUserValue,
    setUserCoordinatesStr:setUserCoordinatesStr,

    setEnabled_Show_Delete_User_Coordinates:setEnabled_Show_Delete_User_Coordinates
};

class ComplexityPlotButtonUserCoordinates extends React.Component {

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
        this.props.setEnabled_Show_Delete_User_Coordinates( false);
        this.props.setUserCoordinates([]);
        this.props.setUserCoordinatesStr('');
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Container fixed className={classes.boxButtons}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={1} justify="center" alignItems="stretch">
                                <Grid item xs={12}>
                                    <ButtonGroup
                                        variant="contained"
                                        color="primary"
                                        aria-label="contained primary button group"
                                        disabled={!this.props.enabled_Show_Delete_User_Coordinates}
                                        fullWidth
                                    >
                                        <Button
                                            startIcon={<VisibilityIcon/>}
                                            onClick={this.drawUserCoordinates}
                                            // disabled={}
                                        >
                                            Show user coordinates
                                        </Button>

                                        <Button
                                            startIcon={<DeleteForeverRoundedIcon/>}
                                            onClick={this.deleteUserCoordinates}
                                            disabled={!this.props.enabled_Show_Delete_User_Coordinates}
                                        >
                                            Delete user coordinates
                                        </Button>
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

const connectSelectParameters = connect(mapStateToProps, actionsCreator)(ComplexityPlotButtonUserCoordinates);
export default withStyles(useStyles)(connectSelectParameters);