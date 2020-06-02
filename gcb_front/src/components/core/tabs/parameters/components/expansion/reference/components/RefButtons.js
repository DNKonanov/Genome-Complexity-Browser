import React from "react";
import {useStyles} from "../../../../style/SelectParametersStyle";
import {connect} from 'react-redux';
import {setRequisite} from "../../../../../../../../redux/actions/selector/actions";
import {withStyles} from '@material-ui/core';


const actionsCreator = {
    setRequisite: setRequisite,
};

class Class extends React.Component {
    handleChange = (e) => {
        e.preventDefault();
        this.props.setRequisite(e.target.name.toUpperCase(), e.target.value);
    };

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