import React from "react";
import {connect} from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";
import {layoutStyle} from "./styles/LayoutStyle";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import {setIs_open_drawer} from "../../../redux/actions/layout/actions";

const mapStateToProps = state => ({
    is_open_drawer: state.layout.leftMenu.is_open_drawer,
});

const actionsCreator = {
    setIs_open_drawer: setIs_open_drawer,
};

class HeaderMenu extends React.Component {
    handleOpenCloseDrawer = (e) => {
        console.log(this.props.is_open_drawer);
        console.log(!this.props.is_open_drawer);

        this.props.setIs_open_drawer(!this.props.is_open_drawer);
    };


    render() {
        const {classes} = this.props;
        return (
            <div>
                <AppBar id={'HEADER_GGG'}
                        position="absolute"
                        className={clsx(classes.appBar, this.props.is_open_drawer && classes.appBarShift)}
                >
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleOpenCloseDrawer}
                            className={clsx(classes.menuButton, this.props.is_open_drawer && classes.menuButtonHidden)}
                        >
                            <SettingsIcon/>
                        </IconButton>
                        <Typography component="h1"
                                    variant="h6"
                                    color="inherit"
                                    noWrap
                                    className={classes.title}
                        >
                            Genome Complexity Browser
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

const connectClass = connect(mapStateToProps, actionsCreator)(HeaderMenu);
export default withStyles(layoutStyle)(connectClass);