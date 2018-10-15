import React, {
    Component
} from 'react';
import 'JSON';
import '../App.css';



class EdgeDescription extends Component {

    render() {
        return (
            <div>
                <b className="EdgeDescription">List of stamms</b>
                <textarea cols="80" rows='8' className="EdgeDescription" value={this.props.edge_description} readOnly/>
            </div>
        )
    }
}

export default EdgeDescription;