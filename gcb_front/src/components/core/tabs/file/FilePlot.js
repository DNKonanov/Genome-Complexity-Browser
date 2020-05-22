import React from "react";
import ComplexityPlotButtonFile from "../parameters/components/buttons/ComplexityPlotButtonFile";
import ComplexityPlotButtonUserCoordinates from "../parameters/components/buttons/ComplexityPlotButtonUserCoordinates";


class FilePlot extends React.Component{
    render() {
        return (
            <div>
                <ComplexityPlotButtonFile/>
                <ComplexityPlotButtonUserCoordinates/>
            </div>
        );
    }
}

export default FilePlot;