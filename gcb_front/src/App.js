import React, {
  Component
} from 'react';

import { Provider } from "react-redux";
import store from "./redux/store/index"

import './App.css';
import CytoscapeDagreGraph from './components/CytoscapeDagreGraph'
import Selector from './components/Selector'
import ReactLoading from 'react-loading';
import EdgeDescription from './components/EdgeDescription';
import SelectedNodes from './components/SelectedNodes';


import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';


import GraphContainer from './components/GraphConatiner'

// import { SERVER_URL } from './constants'

const SERVER_URL = 'dfg'

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

  getData = (data) => {
    this.setState({
      edge_description: data.edge_description,
      selected_nodes: data.selected_nodes,
    })
    console.log(data)
  }

  
  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    console.log('render APP component')
    let load_field;
    if (this.state.loading === true) {
      load_field = <div className="LoadAnimation"><p><b>Loading...</b></p><ReactLoading type={'spin'} color={'#000000'} height={'40px'} width={'40px'} /></div>
    }
    else {
      load_field = <div className="LoadAnimation"><p><b>{this.state.success}</b></p></div>
    }

    const { classes } = this.props;

    return (
      <Provider store={store} >
        < div className={classes.root} >

          {/* <AppBar position="static">
            <Toolbar>
              <IconButton className={classes.menuButton} color="inherit" aria-label="Menu"
                onClick={this.toggleDrawer('top', true)}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                Genome Complexity Browser (alpha-0.1.0)
            </Typography>
            </Toolbar>
          </AppBar>

          <Drawer anchor="left" open={this.state.top} onClose={this.toggleDrawer('top', false)}>
            <div
              tabIndex={0}
              role="button"
              onClick={this.toggleDrawer('left', false)}
              onKeyDown={this.toggleDrawer('left', false)}
            >

            </div>
          </Drawer> */}



          <div className={classes.content}>
            <Selector getDataFromSelector={this.getDataFromSelector} />
            <Paper>
              <GraphContainer data={this.state.data} getData={this.getData} />
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