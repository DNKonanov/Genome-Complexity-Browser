import React, {
  Component
} from 'react';
import tippy from 'tippy.js'

import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import dagre from 'cytoscape-dagre';
import EdgeDescription from '../components/EdgeDescription';
import SelectedNodes from '../components/SelectedNodes';
import '../App.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';


cytoscape.use(dagre);
cytoscape.use(popper);


const styles = theme => ({
  paper: {
    height: 300,
    overflow: 'auto'

  }
});

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
    selected_nodes: 'empty',
    jpg_format: ''
  };


  componentDidMount() {
    this.prepareCy(this.props)
  }


  prepareCy = (nextProps) => {

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
        json_format: JSON.stringify(cy.json()),
        jpg_format: cy.jpg({maxWidth: 10000})
      });
    }.bind(this));

    cy.on('position', function (evt) {
      this.setState({
        json_format: JSON.stringify(cy.json()),
        jpg_format: cy.jpg({maxWidth: 10000})
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

    });

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
      json_format: JSON.stringify(cy.json()),
      jpg_format: cy.jpg({maxWidth: 10000})
    });
  }

  componentWillReceiveProps(nextProps) {

    this.prepareCy(nextProps)
  }

  componentDidUpdate(prevProps, prevState) {
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

  downloadjpg = () => {

    var element = document.createElement("a");
    element.href = this.state.jpg_format;
    element.download = "subgraph.jpg";
    element.click();

  }

  downloadJson = () => {
    var element = document.createElement("a");
    var file = new Blob([this.state.json_format], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "subgraph.json";
    element.click();
  }

  render() {

    const { classes } = this.props;
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
        >Download json graph
        </Button>

        <Button
          style={{ margin: 12 }}
          variant="contained" 
          color="primary"
          component="label"
          onClick={this.downloadjpg}
        >Download JPG
        </Button>


        <Grid alignItems="flex-start" container direction="row" spacing={24}>
          <Grid xs={6} item>
            <Paper className={classes.paper}>
              <EdgeDescription edge_description={this.state.edge_description} />
            </Paper>
            
          </Grid>
          <Grid xs={6} item>
            <Paper className={classes.paper}>
             <SelectedNodes className="LeftFloat" selected_nodes={this.state.selected_nodes} />
            </Paper>
            
          </Grid>
            
        </Grid>
      </div>
    )
  }
}

export default (withStyles(styles)(CytoscapeDagreGraph));