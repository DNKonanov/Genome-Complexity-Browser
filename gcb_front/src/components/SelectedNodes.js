import React, {
    Component
} from 'react';
import 'JSON';
import '../App.css';



class SelectedNodes extends Component {

    render() {
        return (
            <div>
                <b className="EdgeDescription">Selected Nodes</b>
                <textarea cols="60" rows='6' className="EdgeDescription" value={this.props.edge_description} readOnly/>
            </div>
        )
    }
}

export default SelectedNodes;