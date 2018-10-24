import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import klay from 'cytoscape-klay';
import '../App.css';

cytoscape.use( klay );

let conf = {
    boxSelectionEnabled: false,
    autounselectify: true,
    zoomingEnabled: true,
    style: [
        {
            selector: 'node',
            style: {
                'label': 'data(id)',
                'text-opacity': 0.7,
                'font-size': "10pt",
                'text-valign': 'center',
                'text-halign': 'center',
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 'data(penwidth)',
                'weight': 'data(penwidth)',
                "curve-style": "bezier",
                'target-arrow-shape': 'triangle',
                'line-color': 'data(color)',
                'target-arrow-color': 'data(color)'
            }
        }
    ],
    elements: {},
    layout: {
        name: 'klay',
        klay: {
            addUnnecessaryBendpoints: true,
            crossingMinimization: 'LAYER_SWEEP',
            cycleBreaking: 'GREEDY',
            direction: 'RIGHT',
            edgeRouting: 'ORTHOGONAL',
            fixedAlignment: 'BALANCED',
            nodePlacement:'BRANDES_KOEPF',
            edgeSpacingFactor: 3,
            layoutHierarchy: false,
            spacing: 20,
            thoroughness: 40
        }
    }
};

let cyStyle = {
    heigth: '100%',
    width: '100%',
    display: 'block'
};

class CytoscapeKlayGraph extends Component {

    
    constructor(props) {
        super(props);
        this.state = { cy: {} }
    }

    componentDidMount() {
        conf.container = this.cyRef;
        console.log(this.props.data);   
        conf.elements = this.props.data;
        const cy = cytoscape(conf);

        this.state = { cy };
        // cy.json();

    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.cy) {
            this.state.cy.destroy();
        }
        conf.container = this.cyRef;
        
        conf.elements = nextProps.data;

        const cy = cytoscape(conf);

        this.state = { cy };
    }

    componentWillUnmount() {
        if (this.state.cy) {
            this.state.cy.destroy();
        }
    }



    render() {


        return (
            <div className="Container">
                <div style={cyStyle} ref={(cyRef) => {
                    this.cyRef = cyRef;
                }} />
            </div>
        )
    }
}

export default CytoscapeKlayGraph;