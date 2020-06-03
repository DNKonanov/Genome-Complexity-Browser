import React from "react";
import ComplexityPlotButtonFile from "./componetns/complexity/buttons/ComplexityPlotButtonFile";
import ComplexityPlotButtonUserCoordinates from "./componetns/complexity/buttons/ComplexityPlotButtonUserCoordinates";
import a11yProps from "../../../../sctipts/helper/functions/a11yProps";
import TabPanel from "../TabPanel";
import GraphJsonColors from "./componetns/graph/buttons/GraphJsonColors";
import Marker from "./componetns/complexity/selectors/Marker";
import {Card, CardContent, Tab, Tabs, Typography} from '@material-ui/core';

class FilePlot extends React.Component {
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

                {/*COMPLEXITY*/}
                <TabPanel value={this.state.value} index={0}>
                    <div>
                        <ComplexityPlotButtonFile/>
                        <br></br>
                        <Typography variant="h6">
                            Upload user features
                        </Typography>
                        <ComplexityPlotButtonUserCoordinates/>

                        <Marker/>
                    </div>
                </TabPanel>

                {/*GRAPH*/}
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