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
                    <textarea cols="60" rows='6' className="EdgeDescription" value={this.props.edge_description} readOnly/>
                </div>
            </div>
        )
    }
}

export default EdgeDescription;