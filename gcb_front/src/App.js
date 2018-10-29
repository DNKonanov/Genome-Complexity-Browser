import React, {
  Component
} from 'react';
import { Provider } from "react-redux";
import store from "./redux/store/index"
import './App.css';
import Selector from './components/Selector'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import GraphContainer from './components/GraphConatiner'
import GraphLayout from './components/GraphLayout'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});


class App extends Component {

  state = {
    top: false,
    loading: false,
    data: '',
    success: 'Selecting',
    edge_description: '',
    selected_nodes: '',
  }


  
  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    console.log('render APP component')

    const { classes } = this.props;

    return (
      <Provider store={store} >
        < div className={classes.root} >
          <div className={classes.content}>
            <Selector getDataFromSelector={this.getDataFromSelector} />
            <Paper>
              <GraphContainer data={this.state.data}/>
              <GraphLayout  />
            </Paper>

          </div>
        </div>
      </Provider>

    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);