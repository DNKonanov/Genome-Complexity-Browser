import React, { Component } from 'react';
import igv from 'igv';
import '../App.css';


let options = {
    locus: "7:55,085,725-55,276,031",

    reference: {
        id: "hg19"
    },

    tracks: [
        
        {
            name: "Genes",
            url: "https://s3.amazonaws.com/igv.broadinstitute.org/annotations/hg19/genes/gencode.v18.collapsed.bed",
            indexURL: "https://s3.amazonaws.com/igv.broadinstitute.org/annotations/hg19/genes/gencode.v18.collapsed.bed.idx",
            order: Number.MAX_VALUE,
            displayMode: "EXPANDED"

        }
    ]
};

let cyStyle = {
    heigth: '100%',
    width: '100%',
    display: 'block'
};

class IGV extends Component {

    constructor(props) {
        super(props);
        this.state = { cy: {} }
    }

    componentDidMount() {
        const container = this.igvRef;
        const browser = igv.createBrowser(container, options);
    }

    shouldComponentUpdate() { return false;}
    componentWillReceiveProps(nextProps) {}
    componentWillUnmount() {}



    render() {
        return (
            <div className="Container">
                <div style={cyStyle} ref={(igvRef) => {
                    this.igvRef = igvRef;
                }} />
            </div>
        )
    }
}

export default IGV;
