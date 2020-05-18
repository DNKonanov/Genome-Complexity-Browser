import React from "react";
import {connect} from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import {useStyles} from "../../style/SelectParametersStyle";
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
    setUserCoordinatesStr
}
    from "../../../../../../redux/actions/file/readFile";

const mapStateToProps = state => ({
    userCoordinatesStr: state.file.userCoordinatesStr,
});

const actionsCreator = {
    setUserCoordinates: setUserCoordinates,
    setUserValues: setUserValues,
    setMaxUserValue:setMaxUserValue,
    setUserCoordinatesStr:setUserCoordinatesStr,

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
        this.props.setUserCoordinates([]);
        this.props.setUserCoordinatesStr('');
        e.preventDefault()
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Container fixed className={classes.boxButtons}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3} justify="flex-end" alignItems="stretch">
                                <Grid item xs={12}>
                                    <ButtonGroup
                                        variant="contained"
                                        color="primary"
                                        aria-label="contained primary button group"
                                        fullWidth
                                    >
                                        <Button
                                            startIcon={<VisibilityIcon/>}
                                            onClick={this.drawUserCoordinates}
                                        >
                                            Show user coordinates
                                        </Button>
                                        <Button
                                            startIcon={<DeleteForeverRoundedIcon/>}
                                            onClick={this.deleteUserCoordinates}
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