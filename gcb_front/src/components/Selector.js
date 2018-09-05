import React, {
    Component
} from 'react';


class Selector extends Component {

    state = {
        org: 'coli',
        organisms: [],
        og_start: 'OG0000052',
        og_end: 'OG0000410',
        reference: 'GCF_000007365.1_ASM736v1_genomic',
        window: '5',
        tails: '5',
        data: ''
      };

    componentDidMount() {
        fetch('http://127.0.0.1:5000/org/')
            .then(response => response.json())
            .then(data => { this.setState({ ['organisms']: data }); this.setState({ ['org']: data[0] }); });
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
            <div className="parameters">
                <form onSubmit={this.handleSubmit} style={{ margin: 12 }}>
                    <label>
                        Organism:
            <select value={this.state.org} name='org' onChange={this.handleChange}>
                            {this.state.organisms.map(org => <option key={org} value={org}>{org}</option>)}
                        </select>
                    </label><br />
                    <label>
                        OG start:
            <input type="text" name='og_start' value={this.state.og_start} onChange={this.handleChange} />
                    </label> <br />
                    <label>
                        OG end:
            <input type="text" name='og_end' value={this.state.og_end} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Reference:
            <input type="text" name='reference' value={this.state.reference} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Tails:
            <input type="text" name='tails' value={this.state.tails} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Window:
            <input type="text" name='window' value={this.state.window} onChange={this.handleChange} />
                    </label><br />
                    <input type="submit" value="Draw" />
                </form>
            
            </div>
        )
    }

}

export default Selector