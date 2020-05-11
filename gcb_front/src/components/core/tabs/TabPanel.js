import Box from "@material-ui/core/Box";
import React from "react";
import PropTypes from 'prop-types';
import withStyles from "@material-ui/core/styles/withStyles";
import SelectParameters from "./parameters/SelectParameters";
import Search from "./search/Search";
import About from "./about/About";



class TabPanel extends React.Component {

    render() {
        const {classes} = this.props;
        const {children, value, index, ...other} = this.props;
        return (
            <div
                id={`simple-tabpanel-${index}`}
                role="tabpanel"
                hidden={value !== index}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                <Box p={3}>
                    {
                        ((value) => {
                            switch (value) {
                                case 0:
                                    return <SelectParameters/>;
                                case 1:
                                    return <Search/>;
                                case 2:
                                    return <About/>
                            }
                        })(value)
                    }
                </Box>
            </div>
        );
    }
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const useStyles = theme => ({
    drawerProps: {
        width: 1000,
    },
    cardInDrawer: {
        width: 500,
        padding: 50,
    },

});
export default withStyles(useStyles)(TabPanel);