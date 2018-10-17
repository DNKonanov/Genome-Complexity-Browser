import React, {
    Component
} from 'react';
import 'JSON';
import '../App.css';



class EdgeDescription extends Component {

    render() {
        return (
            <div>
                <div className="LeftFloat">
                    <b className="EdgeDescription">List of strains</b>
                    <textarea cols="80" rows='8' className="EdgeDescription" value={this.props.edge_description} readOnly/>
                </div>
            </div>
        )
    }
}

export default EdgeDescription;