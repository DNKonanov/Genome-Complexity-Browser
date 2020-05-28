import React from "react";
import ComplexityPlotButtonFile from "./componetns/complexity/buttons/ComplexityPlotButtonFile";
import ComplexityPlotButtonUserCoordinates from "./componetns/complexity/buttons/ComplexityPlotButtonUserCoordinates";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import a11yProps from "../../../../sctipts/helper/functions/a11yProps";
import TabPanel from "../TabPanel";
import GraphJsonColors from "./componetns/graph/buttons/GraphJsonColors";


class FilePlot extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
    }
    handleChange = (event, newValue) => {
        this.setState({value: newValue});
    };

    render() {
        return (
            <div>
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Complexity" {...a11yProps(0)}/>
                    <Tab label="Graph"{...a11yProps(1)}/>
                </Tabs>

                <TabPanel value={this.state.value} index={0}>
                    <div>
                        <ComplexityPlotButtonFile/>
                        <ComplexityPlotButtonUserCoordinates/>
                    </div>
                </TabPanel>

                <TabPanel value={this.state.value} index={1}>
                    <div>
                        <GraphJsonColors/>
                    </div>
                </TabPanel>
            </div>
        );
    }
}

export default FilePlot;