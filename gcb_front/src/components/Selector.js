import React, {
    Component
} from 'react';
import './Selector.css';
import Plot from 'react-plotly.js';
import onClick from 'react-plotly.js';

class Selector extends Component {

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

    prev_state = {}

    componentDidUpdate(prev_state) {
        // Typical usage (don't forget to compare props):
        if (this.prev_state.org !== this.state.org) {
            let link = 'http://127.0.0.1:5000/org/' + this.state.org + '/stamms/'
            fetch(link)
                .then(response => response.json())
                .then(data => { this.setState({ ['stamms']: data }); this.setState({ ['stamm']: data[0] }); });
                

                       
        }

        if (this.prev_state.stamm != this.state.stamm) {
            let link = 'http://127.0.0.1:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/'
            fetch(link)
                .then(response => response.json())
                .then(data => { this.setState({ ['contigs']: data }); this.setState({ ['contig']: data[0] }); });

                

        }

        if (this.prev_state.contig != this.state.contig) {
            let link = 'http://127.0.0.1:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/' + this.state.contig + '/complexity/'
            fetch(link)
                .then(response => response.json())
                .then(data => { this.setState({ ['complexity']: data[0] }); this.setState({ ['OGs']: data[1] }); this.setState({ ['coord_list']: data[2]})});

                
        }

        this.prev_state = this.state



    }

    
    componentDidMount() {
        fetch('http://127.0.0.1:5000/org/')
            .then(response => response.json())
            .then(data => { this.setState({ ['organisms']: data }); this.setState({ ['org']: data[0] }); });
        
        let link = 'http://127.0.0.1:5000/org/' + this.state.org + '/stamms/'
        fetch(link)
            .then(response => response.json())
            .then(data => { this.setState({ ['stamms']: data }); this.setState({ ['stamm']: data[0] }); });

        link = link + this.state.stamm + '/contigs/'
        fetch(link)
            .then(response => response.json())
            .then(data => { this.setState({ ['contigs']: data }); this.setState({ ['contig']: data[0] }); });
        
        link = link + this.state.contig + '/complexity/'
        fetch(link)
            .then(response => response.json())
            .then(data => { this.setState({ ['complexity']: data[0] }); this.setState({ ['OGs']: data[1] });});

        this.prev_state = this.state
    }

    handleSubmit = (event) => {
        
        this.props.getDataFromSelector(this.state)
        event.preventDefault();
    }

    handleChange = (event) => {
        console.log(event.target.name)
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} style={{ margin: 12 }}>
                    <label>
                        Organism:
            <select className="input" value={this.state.org} name='org' onChange={this.handleChange}>
                            {this.state.organisms.map(org => <option key={org} value={org}>{org}</option>)}
                        </select>
                    </label><br />
                    <label>
                        Reference:
            <select className="input" value={this.state.stamm} name='stamm' onChange={this.handleChange}>
                            {this.state.stamms.map(stamm => <option key={stamm} value={stamm}>{stamm}</option>)}
                        </select>
                    </label><br />
                    <label>
                        Contig:
            <select className="input" value={this.state.contig} name='contig' onChange={this.handleChange}>
                            {this.state.contigs.map(contig => <option key={contig} value={contig}>{contig}</option>)}
                        </select>
                    </label><br />
                    <label>
                    <label>
                        method:
            <select className="input" value={this.state.org} name='org' onChange={this.handleChange}>
                            {this.state.methods.map(method => <option key={method} value={method}>{method}</option>)}
                        </select>
                    </label><br />
                    <label>
                        OG start:
            <input className="input" type="text" name='og_start' value={this.state.og_start} onChange={this.handleChange} />
                    </label> <br />
                    <label>
                        OG end:
            <input className="input" type="text" name='og_end' value={this.state.og_end} onChange={this.handleChange} />
                    </label><br />

                    <label>
                    Coordinate start:
            <input className="input" type="text" name='coord_start' value={this.state.coord_start} onChange={this.handleChange} />
                    </label><br />
                    <label>
                    Coordinate end:
            <input className="input" type="text" name='coord_end' value={this.state.coord_end} onChange={this.handleChange} />
                    </label><br />
                    
                        Tails:
            <input className="input" type="text" name='tails' value={this.state.tails} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Draw paralogous:
            <input className="input" type="text" name='pars' value={this.state.pars} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Window:
            <input className="input" type="text" name='window' value={this.state.window} onChange={this.handleChange} />
                    </label><br />
                    <input type="submit" value="Draw" />
                </form>
            
            <Plot


                data={[
                {   
                    x: this.state.coord_list,
                    y: this.state.complexity,
                    text: this.state.OGs,
                    type: 'scatter',
                    mode: 'lines+points',
                },
                ]}
                layout={ {width: 1500, height: 400, title: 'Genome complexity, ' + this.state.org + ', contig ' + this.state.contig} }
                onClick={(data) => {this.setState({ ['og_start']: data.points[0].text }); 
                                    this.setState({ ['og_end']: data.points[0].text });
                                    this.setState({ ['coord_start']: data.points[0].x }); 
                                    this.setState({ ['coord_end']: data.points[0].x });
                                }}
            />

            </div>
        )
    }

}

export default Selector