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

const actionsCreator = {
    setRequisite: setRequisite,
};


class RefSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opts: props.selectOptions
        }
    }

    handleChange = (e) => {
        e.preventDefault();
        this.props.setRequisite(e.target.name.toUpperCase(), e.target.value);
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <FormControl
                    className={classes.formControl}
                    disabled={false}
                    fullWidth
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

RefSelect.defaultProps = {selectOptions: []};

RefSelect.propTypes = {
    selectOptions: PropTypes.array.isRequired,
};

const connectClass = connect(null, actionsCreator)(RefSelect);
export default withStyles(useStyles)(connectClass);