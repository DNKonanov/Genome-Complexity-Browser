import React from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core/es";
import Container from "@material-ui/core/Container";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./tabs/TabPanel";
import GraphContainer from "../graph/GraphConatiner";
import GraphLayout from "../graph/GraphLayout";
import ComplexityPlot from "../plot/ComplexityPlot";
import {Card, CardHeader} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import SettingsIcon from '@material-ui/icons/Settings';

const mapStateToProps = state => {

};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

class LeftMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            // fixedHeightPaper: clsx(classes.paper, classes.fixedHeight),
            fixedHeightPaper: clsx(this.props.classes.paper, this.props.classes.fixedHeight),
            value: 0,
        };
    }

    handleDrawerOpen = () => {
        this.setState({open: true});
    };
    handleDrawerClose = () => {
        this.setState({open: false});
    };
    handleChange = (event, newValue) => {
        this.setState({value: newValue});
        console.log('newValue', newValue);
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
                                <SettingsIcon/>
                            </IconButton>
                            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                                Genome Complexity Browser
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <Drawer className={classes.drawerProps}
                            anchor={"left"}
                            open={this.state.open}
                            onClose={this.handleDrawerClose}
                    >

                        <div className={classes.tabsProps}>
                            <AppBar position="static">
                                <Tabs value={this.state.value} onChange={this.handleChange}
                                      aria-label="simple tabs example">
                                    <Tab label="Select parameters" {...a11yProps(0)} />
                                    <Tab label="Search" {...a11yProps(1)} />
                                    <Tab label="About" {...a11yProps(2)} />
                                </Tabs>
                            </AppBar>

                            <TabPanel value={this.state.value} index={0}>
                                Select parameters
                            </TabPanel>
                            <TabPanel value={this.state.value} index={1}>
                                Search
                            </TabPanel>
                            <TabPanel value={this.state.value} index={2}>
                                About
                            </TabPanel>
                        </div>
                    </Drawer>


                    <main className={classes.content}>
                        <div className={classes.appBarSpacer}/>
                        <Container maxWidth="lg" className={classes.container}>
                            <Grid container spacing={3}>

                                <Grid item xs={12}>
                                    <Card>
                                        <CardHeader title={'Complexity Plot'}/>
                                        <CardContent>
                                            <ComplexityPlot/>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12}>
                                    <Card>
                                        <CardHeader title={'Graph'}/>
                                        <CardContent>
                                            <GraphContainer data={this.state.data}/>
                                            <GraphLayout/>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
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
    drawerProps: {
        width: 1000,
    },
    cardInDrawer: {
        width: 500,
        padding: 50,
    },
    tabsProps: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    }
});

const connectSettingsLocation = connect(mapStateToProps)(LeftMenu);
export default withStyles(useStyles)(connectSettingsLocation);
