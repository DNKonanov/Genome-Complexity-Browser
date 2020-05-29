import React from "react";
import {useStyles} from "../../../../style/SelectParametersStyle";
import {connect} from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";
import {setRequisite} from "../../../../../../../../redux/actions/selector/actions";
import TextField from "@material-ui/core/TextField";

const actionsCreator = {
    setRequisite: setRequisite,
};

class RefTextFields extends React.Component {
    handleChange = (e) => {
        e.preventDefault();
        this.props.setRequisite(e.target.name.toUpperCase(), e.target.value);
    };

    render() {
        return (
            <div>
                <TextField label={this.props.labelTF}
                           name={this.props.nameTF}
                           value={this.props.valueTF}
                           type={this.props.typeTF}
                           onChange={this.handleChange}
                           disabled={this.props.disTF}
                           error={this.props.errTF}
                           helperText={this.props.helperTextTF}
                />
            </div>
        );
    }
}

RefTextFields.defaultProps = {
    typeTF: 'text',
    disTF: false,
};

const connectClass = connect(null, actionsCreator)(RefTextFields);
export default withStyles(useStyles)(connectClass);