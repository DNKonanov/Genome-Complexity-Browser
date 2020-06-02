import React from "react";
import {useStyles} from "../../../../style/SelectParametersStyle";
import {connect} from 'react-redux';
import {setRequisite} from "../../../../../../../../redux/actions/selector/actions";

import {TextField, Tooltip, withStyles} from '@material-ui/core';

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
                <Tooltip title={this.props.tooltipText}>
                <TextField label={this.props.labelTF}
                           name={this.props.nameTF}
                           value={this.props.valueTF}
                           type={this.props.typeTF}
                           onChange={this.handleChange}
                           disabled={this.props.disTF}
                           error={this.props.errTF}
                           helperText={this.props.helperTextTF}
                />
                </Tooltip>
            </div>
        );
    }
}

RefTextFields.defaultProps = {
    typeTF: 'text',
    disTF: false,
    errTF:false,
    helperTextTF:'',
    tooltipText:'helper',

};

const connectClass = connect(null, actionsCreator)(RefTextFields);
export default withStyles(useStyles)(connectClass);