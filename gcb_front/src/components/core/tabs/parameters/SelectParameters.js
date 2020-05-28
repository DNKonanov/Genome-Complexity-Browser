import React from "react";
import {connect} from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";
import {useStyles} from "./style/SelectParametersStyle";
import ReferenceParametersExpansionPanel from "./components/expansion/reference/main/ReferenceParametersExpansionPanel";
import OtherSettingsExpansionPanel from "./components/expansion/reference/other/OtherSettingsExpansionPanel";

const mapStateToProps = state => ({
    organisms: state.reference.organisms,
});

class SelectParameters extends React.Component {
    render() {
        return (
            <div>
                <ReferenceParametersExpansionPanel/>
                <OtherSettingsExpansionPanel/>
            </div>
        );
    }
}

const connectSelectParameters = connect(mapStateToProps)(SelectParameters);
export default withStyles(useStyles)(connectSelectParameters);