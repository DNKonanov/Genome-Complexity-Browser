import React from "react";
import {useStyles} from "../../../../style/SelectParametersStyle";
import {connect} from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";
import {setRequisite} from "../../../../../../../../redux/actions/selector/actions";

const actionsCreator = {
    setRequisite: setRequisite,
};

class Class extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <div>

            </div>
        );
    }
}

const connectClass = connect(null, actionsCreator)(Class);
export default withStyles(useStyles)(connectClass);