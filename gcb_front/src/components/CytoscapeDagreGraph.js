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


import Phylocanvas from '../components/HierarchyTree'

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


  constructor(props) {
    super(props)
    this.state = {
      cy: false,
      edge_description: 'empty',
      json_format: '',
      selected_nodes: 'empty',
      user_colors: '',
      selected_genomes: [],
      PhyloTree: null,
      default_opacities: [],
    };
  }
  

  componentDidMount() {

    let opacities = []

    this.props.data.edges.forEach(function(ele) {
      opacities.push(ele.data.opacity)
    })

    if (this.props.data.phylotree !== '') {
      this.setState({
        PhyloTree: <Phylocanvas 
        className='PhyloTreeElement' 
        data={this.props.data.phylotree} 
        treeType="rectangular"
        />,
      })
    }


    this.setState({
      default_opacities: opacities,
    })
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
      if (ele.data().id === 'm') {
        tips.push({ 'node': ele.id(), 'tip': makeTippy(ele, 'selected region') })
      }
      tips.push({ 'node': ele.id(), 'tip': makeTippy(ele, ele.data().description) })
    });

    let clicked = []


    cy.on('cxttap', 'node', function (evt) {
      console.log('Right click')
    })


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
            if (organisms[i] === '') {
              continue
            }
            if (ele.data().description.indexOf(organisms[i]) !== -1) {
              ele.style({ 'line-color': 'blue' })
              ele.style({ 'target-arrow-color': 'blue' })
            }
          }
        }
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

        if (ele.data().id === 'm') {
          ele.unselect()
        }
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
    });
  }

  componentWillReceiveProps(nextProps) {

    let opacities = []

    nextProps.data.edges.forEach(function(ele) {
      opacities.push(ele.data.opacity)
    })
    


    this.setState({
      PhyloTree: <Phylocanvas 
                  className='PhyloTreeElement' 
                  data={this.props.data.phylotree} 
                  treeType="rectangular"
                />,
      default_opacities: opacities,
    })

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

  restore_colors = () => {

    let json_cy = this.state.cy.json()

    for (let i = 0; i < json_cy.elements.nodes.length; i++) {
      this.props.data.nodes[i].data.position = json_cy.elements.nodes[i].position
    }
    for (let i = 0; i < this.state.default_opacities.length; i++ ) {

      this.props.data.edges[i].data.opacity = this.state.default_opacities[i];


    }
    
    this.componentWillReceiveProps(this.props);
  }

  downloadjpg = () => {
    var element = document.createElement("a");
    element.href = this.state.cy.jpg({maxWidth:10000});
    element.download = "subgraph.jpg";
    element.click();

  }

  uploadColors = (e) => {
    let user_colors
    if (window.FileReader) {
      let file = e.target.files[0], reader = new FileReader();
      reader.readAsText(file);

      reader.onload = function(r) {

        user_colors = reader.result
        
        let colors = {};
        if (user_colors.length !== 0) {

          let lines;
          lines = user_colors.split('\n');
          for (let i = 0; i < lines.length; i++) {
            
            let line = lines[i].replace(' ', '\t').split('\t');
            colors[line[0]] = line[1]
          }
        }

        this.props.data.nodes.forEach(function (ele) {

          if (ele.data.id in colors) {
            ele.data.color = colors[ele.data.id]
          }
        });
        this.prepareCy(this.props) 

      }.bind(this)

      
      
    }

    else {
      alert('Sorry, your browser does\'nt support for preview');
    }

    

    e.preventDefault()
  }

  filterGenomes = (e) => {

      let genomes = document.getElementsByClassName("PhyloTreeElement pc-container")[0].attributes.selected_genomes.value
      genomes = genomes.substring(1,genomes.length-1).split("','")
      this.setState({
        selected_genomes: genomes
      })
      let json_cy = this.state.cy.json()
      
      for (let i = 0; i < json_cy.elements.nodes.length; i++) {
        this.props.data.nodes[i].data.position = json_cy.elements.nodes[i].position
      }
      if (this.setState.selected_genomes !== []) {
        this.props.data.edges.forEach(function (ele) {
          

          //console.log(ele.data.description.split('\t').filter(value => -1 !== genomes.indexOf(value)))
          if (ele.data.description.split('\t').join('\n').split('\n').filter(value => -1 !== genomes.indexOf(value)).length === 0) {
            //ele.data.color = '#CCCCCC';
            //ele.data.color = '#CCCCCC';
            ele.data.opacity = "0.1";
          } 
        });
      }
      this.prepareCy(this.props)

      e.preventDefault()
  }

  downloadJson = () => {
    var element = document.createElement("a");
    var file = new Blob([JSON.stringify(this.state.cy.json())], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "subgraph.json";
    element.click();
  }

  render() {
    let treeSection;
    if (this.props.data.phylotree === '') {
      treeSection = <div></div>
    }
    else {

      treeSection = 
      <div>
         {this.state.PhyloTree}
         <Button
            style={{ margin: 12 }}
            variant="contained" 
            color="primary"
            component="label"
            onClick={(e) => {this.filterGenomes(e)}}
          >Filter genomes
          </Button>
          <Button
            style={{ margin: 12 }}
            variant="contained" 
            color="primary"
            component="label"
            onClick={this.restore_colors}
          >Restore full graph
          </Button>
        </div>
    }


    const { classes } = this.props;
    return (
      <div>

        {treeSection}

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

        <Button
          style={{ margin: 6 }}
          variant="contained" 
          color="primary"
          component="label"
        >
          Upload colors
          <input
            onChange={(e) => {
              this.uploadColors(e);
              document.getElementById("input-field").value = ""}}
            style={{ display: 'none' }}
            type="file"
            id="input-field"
          />
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