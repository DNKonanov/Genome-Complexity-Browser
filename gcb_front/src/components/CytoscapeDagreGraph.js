import React, {
  Component
} from 'react';
//import 'JSON';
import tippy from 'tippy.js'

import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import dagre from 'cytoscape-dagre';
import EdgeDescription from '../components/EdgeDescription';
import SelectedNodes from '../components/SelectedNodes';
import '../App.css';
import Button from '@material-ui/core/Button';
import removeAllTips from './Selector';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';


cytoscape.use(dagre);
cytoscape.use(popper);

let conf = {
  boxSelectionEnabled: true,
  autounselectify: false,
  zoomingEnabled: true,
  style: [{
    selector: 'node',
    style: {
      'label': 'data(id)',
      'font-size': "10pt",
      'text-valign': 'center',
      'text-halign': 'center',
      'background-color': 'data(color)',
      'border-width': 'data(bwidth)',
      'border-color': 'data(bcolor)',
      'border-opacity': 0.7,
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 'data(penwidth)',
      "curve-style": "unbundled-bezier",
      // "curve-style": "segments",
      'target-arrow-shape': 'triangle',
      'line-color': 'data(color)',
      'target-arrow-color': 'data(color)',
      'opacity': 'data(opacity)'
    }
  },
  {
    selector: ':selected',
    style: {
      'background-color': 'green',
      'line-color': 'green',
      'target-arrow-color': 'green',
      'source-arrow-color': 'green',
      'opacity': 0.5
    }
  }
  ],
  elements: {},
  layout: {
    name: 'preset',
    positions: function (node) { return node.data().position }
    // name: 'dagre',
    // rankDir: "LR",
    // ranker: 'network-simplex',
    // nodeSep: 4, // the separation between adjacent nodes in the same rank
    // edgeSep: 4, // the separation between adjacent edges in the same rank
    // rankSep: 60, // the separation between adjacent nodes in the same rank
  }
};

let cyStyle = {
  heigth: '100%',
  width: '100%',
  display: 'block'
};


class CytoscapeDagreGraph extends Component {

  state = {
    cy: false,
    edge_description: 'empty',
    json_format: '',
    selected_nodes: 'empty'
  };


  componentDidMount() {
    console.log('--CY DID MOUNT')
    this.prepareCy(this.props)
  }

  prepareCy = (nextProps) => {
    console.log("--prepareCy")

    if (this.state.cy) {
      this.state.cy.destroy();
    }

    conf.container = this.cyRef;

    conf.elements = nextProps.data;

    const cy = cytoscape(conf);

    let makeTippy = function (node, text) {
      return tippy(node.popperRef(), {
        html: (function () {
          let div = document.createElement('div');
          div.innerHTML = text;
          return div;
        })(),
        trigger: 'manual',
        arrow: true,
        placement: 'bottom',
        hideOnClick: false,
        multiple: true,
        sticky: true
      }).tooltips[0];
    };

    let tips = []

    cy.nodes().forEach(function (ele) {
      tips.push({ 'node': ele.id(), 'tip': makeTippy(ele, ele.data().description) })
    });

    cy.edges().forEach(function (ele) {
      tips.push({ 'edge': ele.id(), 'tip': makeTippy(ele, ele.data().description) })
    });

    let clicked = []
    cy.on('click', 'node', function (evt) {
      let node_id = evt.target.id()
      let clickedTippy = tips.find(function (ele) {
        return ele.node === node_id;
      });

      if (clicked.includes(node_id)) {
        clicked.splice(clicked.indexOf(node_id), 1);
        clickedTippy.tip.hide();
      }
      else {
        clicked.push(evt.target.id());
        clickedTippy.tip.show();
      }

    });

    cy.on('click', 'edge', function (evt) {

      // console.log(evt.target.controlPoints())
      // console.log(evt.target.segmentPoints())

      this.setState({
        edge_description: evt.target.data().description
      })

      let organisms = evt.target.data().description.split('\n')

      cy.edges().forEach(function (ele) {
        ele.style({ 'line-color': ele.data().color })
        ele.style({ 'target-arrow-color': ele.data().color })
      });

      cy.edges().forEach(function (ele) {

        if (ele.data().color === 'blue') { }
        else {
          for (let i = 0; i < organisms.length; i++) {

            if (ele.data().description.indexOf(organisms[i]) !== -1) {

              ele.style({ 'line-color': 'blue' })
              ele.style({ 'target-arrow-color': 'blue' })
            }
          }
        }
      });

      this.setState({
        json_format: JSON.stringify(cy.json())
      });
    }.bind(this));

    cy.on('position', function (evt) {
      this.setState({
        json_format: JSON.stringify(cy.json())
      });
    }.bind(this));

    cy.on('click', function (evt) {
      if (evt.target.length === undefined) {
        for (let i = 0; i < tips.length; i++) {
          tips[i].tip.hide()
        }
        cy.edges().forEach(function (ele) {

          ele.style({ 'line-color': ele.data().color })
          ele.style({ 'target-arrow-color': ele.data().color })
        });
      }

    }.bind(this));

    cy.on('select', 'node', function () {

      let nodes_list = ''
      cy.nodes().forEach(function (ele) {
        if (ele.selected()) {
          if (ele.data().description !== undefined) nodes_list = nodes_list + ele.data().id + '\t' + ele.data().description.split(':')[0] + '\n'
        }
      });

      this.setState({
        selected_nodes: nodes_list
      })

    }.bind(this));

    this.setState({
      cy: cy,
      json_format: JSON.stringify(cy.json())
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log('--CY WILL RECIEVE PROPS ')

    this.prepareCy(nextProps)
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('--CY DID UPDATE ')
    console.log(this.props)
    console.log(prevProps)
    //if (this.prevProps === undefined) {this.prepareCy(this.props)}
    if (prevProps.layout !== this.props.layout) {
      conf.layout = {
        name: 'preset',
        positions: function (node) { return node.data().position }
      }

      if (this.props.layout === 'dagre') {
        conf.layout = {
          name: 'dagre',
          rankDir: "LR",
          ranker: 'network-simplex',
          nodeSep: 4, // the separation between adjacent nodes in the same rank
          edgeSep: 4, // the separation between adjacent edges in the same rank
          rankSep: 60, // the separation between adjacent nodes in the same rank
        }
      }
      this.prepareCy(this.props)
    }

  }


  downloadJson = () => {
    var element = document.createElement("a");
    var file = new Blob([this.state.json_format], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "subgraph.json";
    element.click();
  }

  render() {
    return (
      <div>

        <div className="Container" >
          <div style={cyStyle} ref={(cyRef) => { this.cyRef = cyRef; }} />
        </div >
        <Button
          style={{ margin: 12 }}
          variant="contained" 
          color="primary"
          component="label"
          onClick={this.downloadJson}
        >Load json graph
        </Button>
        <EdgeDescription edge_description={this.state.edge_description} />
        <SelectedNodes className="LeftFloat" edge_description={this.state.selected_nodes} />
      </div>
    )
  }
}

export default CytoscapeDagreGraph;