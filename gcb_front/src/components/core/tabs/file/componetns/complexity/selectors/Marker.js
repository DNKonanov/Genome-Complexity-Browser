import React from "react";
import {useStyles} from "../../../../parameters/style/SelectParametersStyle";
import {connect} from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";
import {setRequisite} from "../../../../../../../redux/actions/selector/actions";
import RefSelect from "../../../../parameters/components/expansion/reference/components/RefSelect";
import Grid from "@material-ui/core/Grid";

const mapStateToProps = state =>({
    draw_types: state.requisite.draw_types,
    draw_type: state.requisite.draw_type,
    // componentsProps
    disabled_select_reference: state.components.select.disabled_select_reference,
});
const actionsCreator = {
    setRequisite: setRequisite,
};


class Marker extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <div>
                <Grid container spacing={1} justify="center">
                    <Grid item xs={12}>

                        <RefSelect
                            inputLabel={'Marker'}
                            selectNameId={'draw_type'}
                            selectValue={this.props.draw_type}
                            selectOptions={this.props.draw_types}
                            disabledSelect={this.props.disabled_select_reference}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const connectClass = connect(mapStateToProps, actionsCreator)(Marker);
export default withStyles(useStyles)(connectClass);