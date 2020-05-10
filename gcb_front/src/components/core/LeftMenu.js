import React from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core/es";
import Container from "@material-ui/core/Container";
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";

const mapStateToProps = state => {

};

class LeftMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            // fixedHeightPaper: clsx(classes.paper, classes.fixedHeight),
            fixedHeightPaper: clsx(this.props.classes.paper, this.props.classes.fixedHeight),
        };
    }

    handleDrawerOpen = () => {
        this.setState({open: true});
    };
    handleDrawerClose = () => {
        this.setState({open: false});
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                {/*<SideSheet isOpen={this.state.open} onDismiss={this.handleDrawerClose}/>*/}

                <div className={classes.root}>
                    <CssBaseline/>
                    <AppBar position="absolute"
                            className={clsx(classes.appBar, this.state.open && classes.appBarShift)}>
                        <Toolbar className={classes.toolbar}>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.handleDrawerOpen}
                                className={clsx(classes.menuButton, this.state.open && classes.menuButtonHidden)}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                                Dashboard
                            </Typography>
                            <IconButton color="inherit">
                                <Badge badgeContent={4} color="secondary">
                                    <NotificationsIcon/>
                                </Badge>
                            </IconButton>
                        </Toolbar>
                    </AppBar>





                    {/*<Drawer*/}
                    {/*    variant="permanent"*/}
                    {/*    classes={{*/}
                    {/*        paper: clsx(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),*/}
                    {/*    }}*/}
                    {/*    open={this.state.open}*/}
                    {/*>*/}

                        <Drawer className={classes.drawerProps}
                                anchor={"left"}
                                open={this.state.open}
                                onClose={this.handleDrawerClose}
                        >
                        <div className={classes.toolbarIcon}>
                            <IconButton onClick={this.handleDrawerClose}>
                                <ChevronLeftIcon/>
                            </IconButton>
                        </div>
                        {/*<Divider/>*/}
                        {/*<List>{mainListItems}</List>*/}
                        {/*<Divider/>*/}
                        {/*<List>{secondaryListItems}</List>*/}
                        <Card className={classes.cardInDrawer}>
                            <CardContent>
                                <h1>
                                    dewdew
                                </h1>
                                <br/>

                                <h1>
                                    dewdew
                                </h1>
                                <br/>

                            </CardContent>
                        </Card>
                    </Drawer>






                    <main className={classes.content}>
                        <div className={classes.appBarSpacer}/>
                        <Container maxWidth="lg" className={classes.container}>
                            <Grid container spacing={3}>
                                {/* Chart */}
                                <Grid item xs={12} md={8} lg={9}>
                                    <Paper className={this.state.fixedHeightPaper}>
                                        {/*<Chart />*/}
                                    </Paper>
                                </Grid>
                                {/* Recent Deposits */}
                                <Grid item xs={12} md={4} lg={3}>
                                    <Paper className={this.state.fixedHeightPaper}>
                                        {/*<Deposits />*/}
                                    </Paper>
                                </Grid>
                                {/* Recent Orders */}
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        {/*<Orders />*/}
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Box pt={4}>
                                {/*<Copyright />*/}
                            </Box>
                        </Container>
                    </main>
                </div>
            </div>
        );
    }
}


const drawerWidth = 240;

const useStyles = theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },

    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },

    //--------------------------
    drawerProps:{
        width: 1000,
    },
    cardInDrawer:{
        width:500
    }
});

const connectSettingsLocation = connect(mapStateToProps)(LeftMenu);
export default withStyles(useStyles)(connectSettingsLocation);
