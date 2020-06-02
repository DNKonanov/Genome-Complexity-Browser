import React, {Component} from 'react';
import {Provider} from "react-redux";
import store from "./redux/store/index"
import './App.css';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Core from "./components/core/Core";

class App extends Component {
    render() {
        const {classes} = this.props;

        return (
            <Provider store={store}>
                <div>
                    < div className={classes.root}>
                        <div className={classes.content}>
                            <Core/>
                    </div>
                    </div>
                </div>
            </Provider>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};


const styles = theme => ({
    root: {
        flexGrow: 0,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    content: {
        flexGrow: 0,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
});

export default withStyles(styles)(App);