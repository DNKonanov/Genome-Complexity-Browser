import React from "react";
import {connect} from 'react-redux';
import MainMenu from "./layout/MainMenu";
import HeaderMenu from "./layout/HeaderMenu";
import LeftMenu from "./layout/LeftMenu";
import {layoutStyle} from "./layout/styles/LayoutStyle";
import {CssBaseline, withStyles} from "@material-ui/core";


class Core extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <div>
                <div className={classes.root}>
                    <CssBaseline/>

                    <HeaderMenu/>

                    <LeftMenu/>

                    <MainMenu/>
                </div>
            </div>
        );
    }
}

const connectClass = connect(null, null)(Core);
export default withStyles(layoutStyle)(connectClass);