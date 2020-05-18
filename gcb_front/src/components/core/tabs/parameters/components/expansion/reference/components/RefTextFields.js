import React from "react";
import {useStyles} from "../../../../style/SelectParametersStyle";
import {connect} from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";
import {setRequisite} from "../../../../../../../../redux/actions/selector/actions";
import TextField from "@material-ui/core/TextField";

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
                <TextField label={this.props.labelTF}
                           name={this.props.nameTF}
                           value={this.props.valueTF}
                           onChange={this.handleChange}
                />
            </div>
        );
    }
}

const connectClass = connect(null, actionsCreator)(Class);
export default withStyles(useStyles)(connectClass);