import React, {
  Component
} from 'react';
import logo from './logo.svg';
import './App.css';
import CytoscapeDagreGraph from './components/CytoscapeDagreGraph'
import CytoscapeKlayGraph from './components/CytoscapeKlayGraph'
import IGV from './components/IGV'
import Selector from './components/Selector'

class App extends Component {

  state = {
    org: 'Aeromonas_hydrophila',
    stamm: 'GCF_000014805.1_ASM1480v1_genomic',
    contig: 'NC_008570.1',
    organisms: [],
    stamms: [],
    contigs: [],
    complexity: [],
    OGs: [],
    og_start: 'OG0002716',
    og_end: 'OG0002716',
    coord_start: '10000',
    coord_end: '100000',
    coord_list: [],
    reference: '50',
    window: '5',
    tails: '5',
    pars: '0',
    methods: ['window complexity', 'probabilistic window complexity', 'IO complexity', 'probabilistic IO complexity'],
    method: 'window complexity',
    data: ''
  };

  getDataFromSelector = (data_from_selector) => {
    console.log(data_from_selector)
    let link = 'http://127.0.0.1:5000/org/' + data_from_selector.org + '/strain/' + data_from_selector.stamm + '/start/';
    link = link + data_from_selector.og_start + '/end/' + data_from_selector.og_end + '/window/' + data_from_selector.window + '/tails/' + data_from_selector.tails + '/pars/' + data_from_selector.pars
    fetch(link)
      .then(response => response.json())
      .then(data => this.setState({ ['data']: data }))
      .catch(error => console.log('ERROR'));
  }

  constructor(props) {
    super(props);
    this.state = {
      crosshairValues: []
    };
  }


  render() {
    return (
      < div className="App" >
        < header className="App-header" >
          < h1 className="App-title" > Genome Complexity Browser </h1>
        </header>
        <p className="App-intro" >
          <code > Complexity Graph </code>
        </p>

        <CytoscapeDagreGraph data={this.state.data} />

        <Selector getDataFromSelector={this.getDataFromSelector} />
      </div>
      
    );
  }
}

export default App;