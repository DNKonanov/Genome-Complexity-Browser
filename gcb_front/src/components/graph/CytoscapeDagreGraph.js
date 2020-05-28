import React, {Component} from 'react';
import tippy from 'tippy.js'
import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import dagre from 'cytoscape-dagre';
import EdgeDescription from '../other/EdgeDescription';
import SelectedNodes from '../other/SelectedNodes';
import '../../App.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {Paper} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

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
        positions: function (node) {
            return node.data().position
        }
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
        user_colors: '',
    };


    componentDidMount() {
        this.prepareCy(this.props)
    }


    prepareCy = (nextProps) => {
        //создает объект графа и привязывает тултипы

        if (this.state.cy) {
            console.log('IN IF');
            console.log('this.state.cy', this.state.cy);
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
                theme: 'left-align',
                arrow: true,
                placement: 'bottom',
                hideOnClick: false,
                multiple: true,
                sticky: true
            }).tooltips[0];
        };

        let tips = [];

        //для каждого нода создаем тултипы
        cy.nodes().forEach(function (ele) {
            if (ele.data().id === 'm') {
                tips.push({'node': ele.id(), 'tip': makeTippy(ele, 'selected region')})
            }
            tips.push({'node': ele.id(), 'tip': makeTippy(ele, ele.data().description)})
        });

        let clicked = [];

        //предполагалось что-нибудь привязать и по правому клику
        cy.on('cxttap', 'node', function (evt) {
            console.log('Right click')
        });

        //выводит тултипу при клике на нод
        cy.on('click', 'node', function (evt) {
            let node_id = evt.target.id();
            let clickedTippy = tips.find(function (ele) {
                return ele.node === node_id;
            });

            if (clicked.includes(node_id)) {
                clicked.splice(clicked.indexOf(node_id), 1);
                clickedTippy.tip.hide();
            } else {
                clicked.push(evt.target.id());
                clickedTippy.tip.show();
            }

        });

        // при клике на ребро подкрашивает синим все ребра которые пересекаются по геномам с кликнутым
        cy.on('click', 'edge', function (evt) {

            // console.log(evt.target.controlPoints())
            // console.log(evt.target.segmentPoints())

            this.setState({
                edge_description: evt.target.data().description
            });

            let organisms = evt.target.data().description.split('\n');

            cy.edges().forEach(function (ele) {
                ele.style({'line-color': ele.data().color});
                ele.style({'target-arrow-color': ele.data().color})
            });
            cy.edges().forEach(function (ele) {

                if (ele.data().color === 'blue') {
                } else {
                    for (let i = 0; i < organisms.length; i++) {
                        if (organisms[i] === '') {
                            continue
                        }
                        if (ele.data().description.indexOf(organisms[i]) !== -1) {
                            ele.style({'line-color': 'blue'});
                            ele.style({'target-arrow-color': 'blue'})
                        }
                    }
                }
            });

        }.bind(this));

        // клик по пустому месту возвращает исходный вид
        cy.on('click', function (evt) {
            if (evt.target.length === undefined) {
                for (let i = 0; i < tips.length; i++) {
                    tips[i].tip.hide()
                }
                cy.edges().forEach(function (ele) {

                    ele.style({'line-color': ele.data().color})
                    ele.style({'target-arrow-color': ele.data().color})
                });
            }

        });

        // ноты можно выделять массово. Информация о выделенных передается в дочерний омпонент.
        cy.on('select', 'node', function () {

            let nodes_list = '';
            cy.nodes().forEach(function (ele) {

                if (ele.data().id === 'm') {
                    ele.unselect()
                }
                if (ele.selected()) {
                    if (ele.data().description !== undefined) {
                        
                        let text = ele.data().description.split('<br>')[0].replace('</strong>', '').replace('<strong>', '');
                        nodes_list = nodes_list + ele.data().id + '\t' + text + '\n'
                    }
                }
            });

            this.setState({
                selected_nodes: nodes_list
            })

        }.bind(this));

        this.setState({
            cy: cy,
        });
    };

    componentWillReceiveProps(nextProps) {

        this.prepareCy(nextProps)
    }

    componentDidUpdate(prevProps, prevState) {
        //if (this.prevProps === undefined) {this.prepareCy(this.props)}
        if (prevProps.layout !== this.props.layout) {
            conf.layout = {
                name: 'preset',
                positions: function (node) {
                    return node.data().position
                }
            };

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


    // грузит jpg графа
    downloadjpg = () => {
        var element = document.createElement("a");
        // element.href = this.state.cy.jpg({maxWidth: 10000});
        element.href = this.state.cy.jpg({maxWidth: 10000});

        // console.log(element.href, 'element.href');
        console.log('cy', this.state.cy);

        element.download = "subgraph.jpg";
        element.click();
    };

    // можно грузить пользовательские цвета для нодов
    uploadColors = (e) => {
        let user_colors;
        if (window.FileReader) {
            let file = e.target.files[0], reader = new FileReader();
            reader.readAsText(file);

            reader.onload = function (r) {

                user_colors = reader.result;

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


        } else {
            alert('Sorry, your browser does\'nt support for preview');
        }


        e.preventDefault()
    };

    // грузит граф в json-формате
    downloadJson = () => {
        var element = document.createElement("a");
        var file = new Blob([JSON.stringify(this.state.cy.json())], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "subgraph.json";
        element.click();
    };

    render() {

        const {classes} = this.props;
        return (
            <div>

                <div className="Container">
                    <div style={cyStyle}
                         ref={(cyRef) => {
                             this.cyRef = cyRef;
                         }}
                    />
                </div>

                <Button
                    style={{
                        margin: 12,
                        display:'none',
                    }}
                    variant="contained"
                    color="primary"
                    component="label"
                    onClick={this.downloadJson}
                    id={'Download_json_graph'}
                >Download json graph
                </Button>

                <Button
                    style={{margin: 12,display:'none',}}
                    variant="contained"
                    color="primary"
                    component="label"
                    onClick={this.downloadjpg}
                    id={'Download_JPG'}
                >Download JPG
                </Button>

                <Button
                    style={{margin: 6,display:'none',}}
                    variant="contained"
                    color="primary"
                    component="label"
                    id={'Upload_colors'}
                >
                    Upload colors
                    <input
                        onChange={(e) => {
                            this.uploadColors(e);
                            document.getElementById("input-field").value = ""
                        }}
                        style={{display: 'none'}}
                        type="file"
                        id="input-field"
                    />
                </Button>


                <Grid
                    alignItems="flex-start"
                    container direction="row"
                    spacing={2}
                >
                    <Grid xs={6} item>
                        <Paper className={classes.paper}>
                            <EdgeDescription edge_description={this.state.edge_description}/>
                        </Paper>

                    </Grid>

                    <Grid xs={6} item>
                        <Paper className={classes.paper}>
                            <SelectedNodes className="LeftFloat" selected_nodes={this.state.selected_nodes}/>
                        </Paper>

                    </Grid>

                </Grid>
            </div>
        )
    }
}

export default (withStyles(styles)(CytoscapeDagreGraph));