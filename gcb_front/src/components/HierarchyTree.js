import PropTypes from 'prop-types';
import React from 'react';
import PhyloCanvas from 'phylocanvas';
import {treeTypes} from 'phylocanvas';
import _keys from 'lodash.keys';


export default class Phylocanvas extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.string,
    style: PropTypes.object,
    treeType: PropTypes.oneOf(_keys(treeTypes)),
  }


  constructor(props) {
      super(props);
      this.state = {
          selected_genomes: []
      }
  }

  componentDidMount() {
    this.tree = PhyloCanvas.createTree(this.refs.phyloCanvasDiv);
    this.componentDidUpdate({});
    this.tree.on('click', function () {
        this.extractSelectedGenomes()
    }.bind(this))
  }

  extractSelectedGenomes() {
      let genomes = []


      for (var branch in this.tree.branches) {
          if (this.tree.branches[branch].children.length === 0) {
              if (this.tree.branches[branch].selected === true) {
                  genomes.push(branch)
              }
          }
      }
      this.setState({
          selected_genomes: genomes
      })
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (prevProps.data !== props.data) {
      this.tree.load(props.data); 

    }
    if (prevProps.treeType !== props.treeType) {
      this.tree.setTreeType(props.treeType);
    }
  }

  render() {
    const { className, style } = this.props;
    return (
        <div 
            ref="phyloCanvasDiv" 
            style={style} 
            className={className}
            selected_genomes={this.state.selected_genomes}
        />
    );
  }
}