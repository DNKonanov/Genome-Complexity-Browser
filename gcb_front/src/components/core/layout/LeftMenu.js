import React from 'react';
import {AppBar, Drawer, Tab, Tabs, withStyles, Tooltip, Typography} from '@material-ui/core';
import {connect} from "react-redux";
import TabPanel from "../tabs/TabPanel";

import {layoutStyle} from "./styles/LayoutStyle";
import {setIs_open_drawer, setCurrentTab} from "../../../redux/actions/layout/actions";
import SelectParameters from "../tabs/parameters/SelectParameters";
import Search from "../tabs/search/Search";
import FilePlot from "../tabs/file/FilePlot";
import About from "../tabs/about/About";
import a11yProps from "../../../sctipts/helper/functions/a11yProps";

const mapStateToProps = state => ({
    is_open_drawer: state.layout.leftMenu.is_open_drawer,
    current_tab: state.layout.leftMenu.current_tab,
    disabled_select_reference: state.components.select.disabled_select_reference
});

const actionsCreator = {
    setIs_open_drawer: setIs_open_drawer,
    setCurrentTab: setCurrentTab
};
class LeftMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
    }
    handleChange = (event, newValue) => {
        this.props.setCurrentTab(newValue);
    };


    handleOpenCloseDrawer = (e) => {
        this.props.setIs_open_drawer(!this.props.is_open_drawer);
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Drawer className={classes.drawerProps}
                        anchor={"left"}
                        open={this.props.is_open_drawer}
                        onClose={this.handleOpenCloseDrawer}
                >
                    <div className={classes.tabsProps}>
                        <AppBar position="static">
                            <Tabs value={this.props.current_tab}
                                  onChange={this.handleChange}
                                  aria-label="simple tabs example"
                            >

                                <Tooltip
                                    title={<React.Fragment>
                                        <Typography variant='body2'>
                                        Select a genome, the region for graph representation, and settings
                                        </Typography>
                                    </React.Fragment>}
                                >
                                    <Tab label="Select parameters" {...a11yProps(0)} disabled={this.props.disabled_select_reference} />
                                </Tooltip>

                                
                                
                                <Tooltip
                                    title={<React.Fragment>
                                        <Typography variant='body2'>
                                        Search by gene product
                                        </Typography>
                                    </React.Fragment>}
                                >
                                    <Tab label="Search" {...a11yProps(1)} disabled={this.props.disabled_select_reference} />
                                </Tooltip>

                                <Tooltip
                                    title={<React.Fragment>
                                        <Typography variant='body2'>
                                        Download complexity values, graph data, upload features files
                                        </Typography>
                                    </React.Fragment>}
                                >
                                    <Tab label="File" {...a11yProps(2)} disabled={this.props.disabled_select_reference} />
                                </Tooltip>

                                
                                <Tab label="About" {...a11yProps(3)} />
                            </Tabs>
                        </AppBar>

                        <TabPanel value={this.props.current_tab} index={0}>
                            <SelectParameters/>
                        </TabPanel>

                        <TabPanel value={this.props.current_tab} index={1}>
                            <Search/>
                        </TabPanel>

                        <TabPanel value={this.props.current_tab} index={2}>
                            <FilePlot/>
                        </TabPanel>

                        <TabPanel value={this.props.current_tab} index={3}>
                            <About/>
                        </TabPanel>
                    </div>
                </Drawer>
            </div>
        );
    }
}

const connectSettingsLocation = connect(mapStateToProps, actionsCreator)(LeftMenu);
export default withStyles(layoutStyle)(connectSettingsLocation);
