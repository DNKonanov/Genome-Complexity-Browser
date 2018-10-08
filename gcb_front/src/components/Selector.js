import React, {
    Component
} from 'react';
import './Selector.css';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import * as math from 'mathjs'

class Selector extends Component {

    state = {
        org: 'Escherichia_coli',
        stamm: '0',
        contig: 'NC_000913.3',
        organisms: [],
        stamms: [],
        contigs: [],
        complexity: [],
        max_complexity: 0,
        OGs: [],
        og_start: 'OG0002716',
        og_end: 'OG0002716',
        coord_start: 0,
        coord_end: 0,
        coord_list: [],
        length_list: [],
        reference: '50',
        window: '5',
        tails: '5',
        depth: '30',
        freq_min: '2',
        pars: false,
        operons: true,
        methods: ['window complexity', 'probabilistic window complexity', 'IO complexity', 'probabilistic IO complexity'],
        method: 'window complexity',
        user_coordinates_str: '',
        user_coordinates: [],
        user_values: [],
        draw_types: ['line', 'markers'],
        draw_type: 'line plot',
        data: '',
        src: ''
      };

    prev_state = {}

    componentDidUpdate(prev_state) {

        if (this.prev_state.org !== this.state.org) {
            let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/'
            fetch(link)
                .then(response => response.json())
                .then(data => { this.setState({ ['stamms']: data }); this.setState({ ['stamm']: data[0] }); });
                

                       
        }

        if (this.prev_state.stamm != this.state.stamm) {
            let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/'
            fetch(link)
                .then(response => response.json())
                .then(data => { this.setState({ ['contigs']: data }); this.setState({ ['contig']: data[0] }); });

                

        }

        if (this.prev_state.contig != this.state.contig){
            
            if (this.state.pars == true) {
                var pars_int = 1
            }
            else var pars_int = 0

            let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/' + this.state.contig + '/methods/' + this.state.method + '/pars/' + pars_int + '/complexity/'
            fetch(link)
                .then(response => response.json())
                .then(data => { this.setState({ ['complexity']: data[0] }); this.setState({ ['length_list']: data[3] }); this.setState({ ['OGs']: data[1] }); this.setState({ ['coord_list']: data[2]})});

                
        }

        if (this.prev_state.method != this.state.method) {
            if (this.state.pars == true) {
                var pars_int = 1
            }
            else var pars_int = 0

            let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/' + this.state.contig + '/methods/' + this.state.method + '/pars/' + pars_int + '/complexity/'
            fetch(link)
                .then(response => response.json())
                .then(data => { this.setState({ ['complexity']: data[0] }); this.setState({['max_complexity']: math.max(this.state.complexity)}); this.setState({ ['length_list']: data[3] }); this.setState({ ['OGs']: data[1] }); this.setState({ ['coord_list']: data[2]})});

        }

        if (this.prev_state.pars != this.state.pars) {
            if (this.state.pars == true) {
                var pars_int = 1
            }
            else var pars_int = 0

            let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/' + this.state.stamm + '/contigs/' + this.state.contig + '/methods/' + this.state.method + '/pars/' + pars_int + '/complexity/'
            fetch(link)
                .then(response => response.json())
                .then(data => { this.setState({ ['complexity']: data[0] }); this.setState({['max_complexity']: math.max(this.state.complexity)}); this.setState({ ['length_list']: data[3] }); this.setState({ ['OGs']: data[1] }); this.setState({ ['coord_list']: data[2]})});

        }


        if (this.prev_state.coord_start != this.state.coord_start) {
            var index = 0
            while (this.state.coord_list[index] < this.state.coord_start) {
                index = index + 1
            }

            this.setState({['og_start']: this.state.OGs[index]})
        }

        if (this.prev_state.coord_end != this.state.coord_end) {
            var index = 0
            while (this.state.coord_list[index] < this.state.coord_end) {
                index = index + 1
            }

            this.setState({['og_end']: this.state.OGs[index]})
        }

        this.prev_state = this.state



    }

    
    componentDidMount() {
        fetch('http://10.210.29.150:5000/org/')
            .then(response => response.json())
            .then(data => { this.setState({ ['organisms']: data }); this.setState({ ['org']: data[0] }); });
        
        let link = 'http://10.210.29.150:5000/org/' + this.state.org + '/stamms/'
        fetch(link)
            .then(response => response.json())
            .then(data => { this.setState({ ['stamms']: data }); this.setState({ ['stamm']: data[0] }); });

        link = link + this.state.stamm + '/contigs/'
        fetch(link)
            .then(response => response.json())
            .then(data => { this.setState({ ['contigs']: data }); this.setState({ ['contig']: data[0] }); });
        
        link = link + this.state.contig + '/methods/' + this.state.method + '/pars/0/complexity/'
        fetch(link)
            .then(response => response.json())
            .then(data => { this.setState({ ['complexity']: data[0] }); this.setState({ ['OGs']: data[1] });});

        var index = 0
        while (this.state.coord_list[index] < this.state.coord_start) {
            index = index + 1
        }

        this.setState({['og_start']: this.state.OGs[index]})
        var index = 0
        while (this.state.coord_list[index] < this.state.coord_end) {
            index = index + 1
        }

        this.setState({['og_end']: this.state.OGs[index]})
    
    }

    handleSubmit = (event) => {
        
        this.props.getDataFromSelector(this.state)
        event.preventDefault();
    }
    
    
    drawUserCoordinates = (e) =>{
        if (this.state.user_coordinates_str.length != 0) {
            
            let string = this.state.user_coordinates_str.replace(' ', '').replace('\t', '').replace('\n', '')

            let lines;
            lines = string.split(',');
            this.setState({['user_coordinates']: []})
            let coord = []
            let values = []
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].split(':');
                coord.push(parseInt(line[0]))
                values.push(parseFloat(line[1]))
            }
            this.setState({
                user_coordinates: coord,
                user_values: values
            })

        }
        e.preventDefault()
    }
    

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    checkPars = (event) => {

        this.setState({ 'pars' : event.target.checked });
    }

    checkOperons = (event) => {
        this.setState({ 'operons' : event.target.checked });
    }

    inputFileChanged = (e) => {

        if(window.FileReader){
            let file = e.target.files[0], reader = new FileReader();
            reader.onload = function(r){
                this.setState({
                    user_coordinates_str: r.target.result
                });
            }.bind(this)
            reader.readAsText(file);
        }
        else {
            alert('Sorry, your browser does\'nt support for preview');
        }
    }

    render() {


        return (
            <div>
                <form className="bblock" onSubmit={this.handleSubmit} style={{ margin: 12 }}>
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
            <select className="input" value={this.state.method} name='method' onChange={this.handleChange}>
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
                        Depth:
            <input className="input" type="text" name='depth' value={this.state.depth} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Minimal edge:
            <input className="input" type="text" name='freq_min' value={this.state.freq_min} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Draw paralogous:
            <input type="checkbox" name='pars' checked={this.state.pars} onChange={this.checkPars} />
                    </label><br />
                    <label>
                        Draw operons:
            <input type="checkbox" name='operons' checked={this.state.operons} onChange={this.checkOperons} />
                    </label><br />
                    <label>
                        Window:
            <input className="input" type="text" name='window' value={this.state.window} onChange={this.handleChange} />
                    </label><br />
                    <input type="submit" value="Draw" />
                </form>

                <form className="inputField">
                    <p><b>Input values</b> (format is "coord1:value1,coord2:value2, ... ". Spaces, tabs and EOLs are allowed)</p>,
                    <textarea cols="100" rows="10" name='user_coordinates' onChange={e => this.setState({ ['user_coordinates_str'] : e.target.value })} value={this.state.user_coordinates_str}/>
                    <br/>
                    <input style={{margin: 12}} type="submit" value='Show user values' onClick={(e) => {this.drawUserCoordinates(e)}}/>
                        
                    <label>
                        <input type="file" ref="input_reader" onChange={this.inputFileChanged}/>
                    </label>

                    <label>
                        <select style={{margin: 12}} value={this.state.draw_type} name='draw_types' onChange={e => this.setState({draw_type: e.target.value})}>
                                {this.state.draw_types.map(draw_type => <option key={draw_type} value={draw_type}>{draw_type}</option>)}
                        </select>
                    </label>
                </form>
                
            
            <Plot


                data={[
                {   
                    x: this.state.coord_list,
                    y: this.state.complexity,
                    text: this.state.OGs,
                    type: 'bar',
                    mode: 'lines',
                    width: this.state.length_list,
                    name: 'complexity'
                },

                {   
                    x: [this.state.coord_start, this.state.coord_start],
                    y: [-this.state.max_complexity/2, this.state.max_complexity],
                    mode: 'lines',
                    name: 'left edge'
                },
                {   
                    x: [this.state.coord_end, this.state.coord_end],
                    y: [-this.state.max_complexity/2, this.state.max_complexity],
                    mode: 'lines',
                    name: 'rigth edge'
                },

                {
                    x: this.state.user_coordinates,
                    y: this.state.user_values,
                    mode: this.state.draw_type,
                    name: 'user values',
                    opacity: 0.5,
                    yaxis: 'y2',
                    marker: {
                        size: 5,
                      },
                }


                ]}
                layout={ 
                    {
                        width: window.innerWidth, 
                        height: 400, 
                        title: 'Genome complexity, ' + this.state.org + ', contig ' + this.state.contig + ', ' + this.state.method,
                        
                        xaxis: {
                            title: 'Coordinate',
                        },

                        yaxis: {
                            title: 'complexity',
                            overlaying: 'y2'
                        },
                        
                        yaxis2: {
                            title: 'user values',
                            side: 'right'
                        }
                        
                    } 
                }
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