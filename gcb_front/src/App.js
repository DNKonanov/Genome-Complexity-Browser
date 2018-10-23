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


import SelectorAndPlot from './components/SelectrorAndPlot'
import { SERVER_URL } from './constants'

import ComplexityChart from './components/ComplexityChart'

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

  getDataFromSelector = (data_from_selector) => {

    console.log('GOT DATA FROM SELECTOR')
    let pars_int = 0
    if (data_from_selector.pars === true) pars_int = 1

    let operons_int = 0
    if (data_from_selector.operons === true) operons_int = 1

    let link = SERVER_URL + '/org/' + data_from_selector.org + '/strain/' + data_from_selector.stamm + '/contig/' + data_from_selector.contig + '/start/';
    link = link + data_from_selector.og_start + '/end/' + data_from_selector.og_end + '/window/' + data_from_selector.window + '/tails/' + data_from_selector.tails + '/pars/' + pars_int + '/operons/' + operons_int + '/depth/' + data_from_selector.depth + '/freq_min/' + data_from_selector.freq_min
    this.setState({
      loading: true
    })
    fetch(link)
      .then(response => response.json())
      .then(data => {
        this.setState({
          data: data,
          loading: false,
          success: 'Success!'
        })
      })
      .catch(error => {
        console.log('ERROR');
        this.setState({
          success: 'Undefined error, please choose other OG or coordinates',
          loading: false
        })
      });
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

          <AppBar position="static">
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
          </Drawer>



          <div className={classes.content}>

            {/* <SelectorAndPlot/> */}
            <Selector getDataFromSelector={this.getDataFromSelector} />
            {/* <ComplexityChart /> */}
            {/* <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Complexity Plot</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <ComplexityChart />
            </ExpansionPanelDetails>
          </ExpansionPanel> */}


            <Paper>
              <CytoscapeDagreGraph data={this.state.data} getData={this.getData} />
            </Paper>
            {load_field}

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