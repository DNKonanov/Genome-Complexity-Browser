import React from "react";
import {useStyles} from "../../../../style/SelectParametersStyle";
import {connect} from 'react-redux';
import {setRequisite} from "../../../../../../../../redux/actions/selector/actions";
import PropTypes from 'prop-types';
import {setDisabled_select_reference} from "../../../../../../../../redux/actions/components/actions";

import {MenuItem, FormControl, Select,InputLabel, Tooltip, withStyles} from '@material-ui/core';


const mapStateToProps = (state) => ({
    disabled_select_reference: state.components.select.disabled_select_reference,
});

const actionsCreator = {
    setRequisite: setRequisite,
    setDisabled_select_reference: setDisabled_select_reference,
};

class GenomeSelector extends React.Component {
    handleChange = async (e) => {
        e.preventDefault();
        if (e.target.name === 'org')
            this.props.setDisabled_select_reference(false);

        await this.props.setRequisite(e.target.name.toUpperCase(), e.target.value);
    };

    render() {
        const {classes} = this.props;

        let computed_array = []
        let uncomputed_array = []


        for (let i = 0; i < this.props.names.length; i++) {
            
            if (this.props.computed[i] === 'true') {
                computed_array.push(
                    [this.props.computed[i], this.props.selectOptions[i], this.props.selectOptions[i]]
                )
            }
            else {
                uncomputed_array.push(
                    [this.props.computed[i], this.props.selectOptions[i], this.props.selectOptions[i]]
                )
            }
        }



        let common_array = computed_array.concat(uncomputed_array)
        
        let computed = []
        let names = []
        let selectOptions = []

        common_array.forEach( e => {
            computed.push(e[0])
            names.push(e[1])
            selectOptions.push(e[2])
        })


        return (
            <div>
                <FormControl
                    className={classes.formControl}
                    fullWidth
                    disabled={this.props.disabledSelect}
                >
                    <InputLabel id={this.props.selectNameId}>{this.props.inputLabel}</InputLabel>

                    <Tooltip
                        title={this.props.tooltipText}
                        aria-label="add"
                        placement="right-end"
                    >
                        <Select id={this.props.selectNameId}
                                name={this.props.selectNameId}
                                value={this.props.selectValue}
                                onChange={this.handleChange}
                                autoWidth={false}
                        >
                            {
                                selectOptions.map(stamm => (
                                    <MenuItem 
                                        key={stamm} 
                                        value={stamm}> 

                                        {
                                            computed[selectOptions.indexOf(stamm)] === 'true' ? <b>{stamm  + ' (' + names[selectOptions.indexOf(stamm)] + ')'} </b> : stamm  + ' (' + names[selectOptions.indexOf(stamm)] + ')'
                                        }

                                        
                                    </MenuItem>))
                            }

                        </Select>
                    </Tooltip>
                </FormControl>
            </div>
        );
    }
}

GenomeSelector.defaultProps = {
    selectOptions: [],
    disabledSelect: true,
    focusedSelect: false,
    tooltipText:''
};

GenomeSelector.propTypes = {
    selectOptions: PropTypes.array.isRequired,
};

const connectClass = connect(mapStateToProps, actionsCreator)(GenomeSelector);
export default withStyles(useStyles)(connectClass);