import React, {
  Component
} from 'react';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

import ComplexityChart from './ComplexityChart'

import Selector from './Selector'

import { SERVER_URL } from '../constants'


class SelectorAndPlot extends Component {

  state = {
    data_to_plot: {}
  };

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

  getDataForPlot = (data_to_plot) => {
    console.log('GOT DATA TO PLOT')

    
  }

  render() {
    return (

      <div>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Selector</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Selector getDataFromSelector={this.getDataFromSelector} />
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Selector</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {/* <ComplexityChart data_to_plot={this.state.data_to_plot} /> */}
            </ExpansionPanelDetails>
          </ExpansionPanel>

      </div>

    );
  }


}

export default SelectorAndPlot