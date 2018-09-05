import React, {
  Component
} from 'react';
import logo from './logo.svg';
import './App.css';
import './pure-drawer.css'

import CytoscapeDagreGraph from './components/CytoscapeDagreGraph'
import CytoscapeKlayGraph from './components/CytoscapeKlayGraph'
import IGV from './components/IGV'
import Selector from './components/Selector'

class App extends Component {

  state = {
    org: 'coli',
    organisms: [],
    og_start: 'OG0002716',
    og_end: 'OG0002716',
    reference: '50',
    window: '5',
    tails: '5',
    data: ''
  };

  getDataFromSelector = (data_from_selector) => {
    console.log(data_from_selector)
    let link = 'http://127.0.0.1:5000/org/' + data_from_selector.org + '/strain/' + data_from_selector.reference + '/start/';
    link = link + data_from_selector.og_start + '/end/' + data_from_selector.og_end + '/window/' + data_from_selector.window + '/tails/' + data_from_selector.tails
    fetch(link)
      .then(response => response.json())
      .then(data => this.setState({ ['data']: data }))
      .catch(error => console.log('ERROR'));
  }

  render() {
    return (
      < div className="pure-container" data-effect="pure-effect-slide" >

        <input type="checkbox" id="pure-toggle-left" className="pure-toggle" data-toggle="left"></input>
        <label className="pure-toggle-label" for="pure-toggle-left" data-toggle-label="left">
            <span className="pure-toggle-icon"></span>
        </label>

        <div className="pure-drawer" data-position="left">
        <Selector getDataFromSelector={this.getDataFromSelector} />
        </div>
        <div className="pure-pusher-container">
            <div className="pure-pusher">
            < header className="App-header" >
          < h1 className="App-title" > Genome Complexity Browser </h1>
        </header>
        <p className="App-intro" >
          <code > Complexity Graph </code>
        </p>

        <CytoscapeDagreGraph data={this.state.data} />
        <CytoscapeKlayGraph data={this.state.data} />
        
            </div>
        </div>
        <label className="pure-overlay" for="pure-toggle-left" data-overlay="left"></label>
        {/* <IGV / > */}

      </div>
    );
  }
}

export default App;