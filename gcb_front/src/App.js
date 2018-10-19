import React, {
  Component
} from 'react';
import './App.css';
import CytoscapeDagreGraph from './components/CytoscapeDagreGraph'
import Selector from './components/Selector'
import ReactLoading from 'react-loading';
import EdgeDescription from './components/EdgeDescription';
import SelectedNodes from './components/SelectedNodes';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: '',
      success: 'Selecting',
      edge_description: '',
      selected_nodes: '',
    };
  }

  getData = (data) => {
    this.setState({
      edge_description: data.edge_description,
      selected_nodes: data.selected_nodes,
    })
    console.log(data)
  }

  getDataFromSelector = (data_from_selector) => {
    let pars_int = 0
    if (data_from_selector.pars === true) pars_int = 1
    
    let operons_int = 0
    if (data_from_selector.operons === true) operons_int = 1
    

    let link = 'http://10.210.29.150:5000/org/' + data_from_selector.org + '/strain/' + data_from_selector.stamm + '/contig/' + data_from_selector.contig + '/start/';
    link = link + data_from_selector.og_start + '/end/' + data_from_selector.og_end + '/window/' + data_from_selector.window + '/tails/' + data_from_selector.tails + '/pars/' + pars_int + '/operons/' + operons_int + '/depth/' + data_from_selector.depth + '/freq_min/' + data_from_selector.freq_min
    this.setState({
      loading: true
    })
    fetch(link)
      .then(response => response.json())
      .then(data => {this.setState({ 
        data: data,
        loading: false,
        success: 'Success!'
      })})
      .catch(error => {console.log('ERROR'); 
      this.setState({
        success: 'Undefined error, please choose other OG or coordinates',
        loading: false
      
      })});
      
  }



  render() {

    console.log('render')
    let load_field;
    if (this.state.loading === true){
      load_field = <div className="LoadAnimation"><p><b>Loading...</b></p><ReactLoading type={'spin'} color={'#000000'} height={'40px'} width={'40px'}/></div>
    }
    else {
      load_field = <div className="LoadAnimation"><p><b>{this.state.success}</b></p></div> 
    }

    return (
      < div className="App" >
        < header className="App-header" >
          < h1 className="App-title" > Genome Complexity Browser (alpha-0.1.0) </h1>
        </header>
        <p className="App-intro" >
          <code > Complexity Graph </code>
        </p>

        
        <CytoscapeDagreGraph data={this.state.data} getData={this.getData}/>
        {load_field}
        <Selector getDataFromSelector={this.getDataFromSelector}/>
        <EdgeDescription edge_description={this.state.edge_description}/>
        <SelectedNodes  className="LeftFloat" edge_description={this.state.selected_nodes}/>

      </div>
      
    );
  }
}

export default App;