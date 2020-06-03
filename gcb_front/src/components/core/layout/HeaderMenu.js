import React from "react";
import {connect} from 'react-redux';
import {layoutStyle} from "./styles/LayoutStyle";
import clsx from "clsx";
import {setIs_open_drawer} from "../../../redux/actions/layout/actions";
import {AppBar, IconButton, Toolbar, Tooltip, Typography, withStyles} from '@material-ui/core';
import MenuSharpIcon from '@material-ui/icons/MenuSharp';

const mapStateToProps = state => ({
    is_open_drawer: state.layout.leftMenu.is_open_drawer,
});

const actionsCreator = {
    setIs_open_drawer: setIs_open_drawer,
};

class HeaderMenu extends React.Component {
    handleOpenCloseDrawer = (e) => {
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
                        <Tooltip title="helper" aria-label="add">
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.handleOpenCloseDrawer}
                                className={clsx(classes.menuButton, this.props.is_open_drawer && classes.menuButtonHidden)}
                            >
                                <MenuSharpIcon/>
                            </IconButton>
                        </Tooltip>

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