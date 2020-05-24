import React from "react";
import {useStyles} from "../../../../style/SelectParametersStyle";
import {connect} from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";
import {setRequisite} from "../../../../../../../../redux/actions/selector/actions";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import PropTypes from 'prop-types';
import {setDisabled_select_reference} from "../../../../../../../../redux/actions/components/actions";

const mapStateToProps = (state)=>({
    disabled_select_reference: state.components.select.disabled_select_reference,
});

const actionsCreator = {
    setRequisite: setRequisite,
    setDisabled_select_reference:setDisabled_select_reference,
};

class RefSelect extends React.Component {
    handleChange = async (e) => {
        e.preventDefault();
        if(e.target.name === 'org')
            this.props.setDisabled_select_reference(false) ;

        await this.props.setRequisite(e.target.name.toUpperCase(), e.target.value);
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <FormControl
                    className={classes.formControl}
                    fullWidth
                    disabled={this.props.disabledSelect}
                >
                    <InputLabel id={this.props.selectNameId}>{this.props.inputLabel}</InputLabel>

                    <Select id={this.props.selectNameId}
                            name={this.props.selectNameId}
                            value={this.props.selectValue}
                            onChange={this.handleChange}
                            autoWidth={false}
                    >
                        {
                            this.props.selectOptions.map(opt => (
                                <MenuItem key={opt}
                                          value={opt}
                                >{opt}</MenuItem>
                            ))
                        }

                    </Select>
                </FormControl>
            </div>
        );
    }
}

RefSelect.defaultProps = {
    selectOptions: [],
    disabledSelect: true,
    focusedSelect: false
};

RefSelect.propTypes = {
    selectOptions: PropTypes.array.isRequired,
};

const connectClass = connect(mapStateToProps, actionsCreator)(RefSelect);
export default withStyles(useStyles)(connectClass);