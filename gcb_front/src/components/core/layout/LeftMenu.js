import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core/es";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "../tabs/TabPanel";

import {layoutStyle} from "./styles/LayoutStyle";
import {setIs_open_drawer} from "../../../redux/actions/layout/actions";

const mapStateToProps = state => ({
    is_open_drawer: state.layout.leftMenu.is_open_drawer,
});

const actionsCreator = {
    setIs_open_drawer: setIs_open_drawer,
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
            value: 0,
        };
    }

    handleChange = (event, newValue) => {
        this.setState({value: newValue});
    };

    handleOpenCloseDrawer = (e) => {
        console.log(this.props.is_open_drawer);
        console.log(!this.props.is_open_drawer);
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
                            <Tabs value={this.state.value} onChange={this.handleChange}
                                  aria-label="simple tabs example">
                                <Tab label="Select parameters" {...a11yProps(0)} />
                                <Tab label="Search" {...a11yProps(1)} />
                                {/*<Tab label="File" {...a11yProps(2)} />*/}
                                {/*<Tab label="About" {...a11yProps(3)} />*/}
                            </Tabs>
                        </AppBar>

                        <TabPanel value={this.state.value} index={0}>
                            Select parameters
                        </TabPanel>

                        <TabPanel value={this.state.value} index={1}>
                            Search
                        </TabPanel>

                        {/*<TabPanel value={this.state.value} index={2}>*/}
                        {/*    File*/}
                        {/*</TabPanel>*/}

                        {/*<TabPanel value={this.state.value} index={3}>*/}
                        {/*    About*/}
                        {/*</TabPanel>*/}
                    </div>
                </Drawer>
            </div>
        );
    }
}

const connectSettingsLocation = connect(mapStateToProps, actionsCreator)(LeftMenu);
export default withStyles(layoutStyle)(connectSettingsLocation);
