import React from "react";
import {Button, Card, CardContent, CardHeader, Container, Fab, Grid, Tooltip, withStyles} from '@material-ui/core';
import MenuSharpIcon from '@material-ui/icons/MenuSharp';
import {connect} from 'react-redux';
import ComplexityPlot from "../../plot/ComplexityPlot";
import GraphContainer from "../../graph/GraphConatiner";
import {layoutStyle} from "./styles/LayoutStyle";
import {setIs_open_drawer} from "../../../redux/actions/layout/actions";

const mapStateToProps = state => ({
    is_open_drawer: state.layout.leftMenu.is_open_drawer,
});

const actionsCreator = {
    setIs_open_drawer: setIs_open_drawer,
};

class MainMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scrollValue: 0,
            headerOffsetHeight: 0,
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.setState({headerOffsetHeight: document.getElementById('HEADER_GGG').offsetHeight})
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = (event) => {
        this.setState({
            scrollValue: window.pageYOffset
        });
    };

    handleOpenCloseDrawer = (e) => {
        this.props.setIs_open_drawer(!this.props.is_open_drawer);
    };

    handleDraw = () => {
        document.getElementById('graphButtonDraw').click();
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <div className={classes.appBarSpacer}/>

                <Grid container
                      spacing={0}
                      justify="flex-start"
                >
                    <Grid item
                          xs={1}
                    >
                        <div style={{
                            marginTop: document.documentElement.clientHeight / 2 - this.state.headerOffsetHeight + this.state.scrollValue,
                        }}>
                            <Tooltip title="helper" aria-label="add">
                                <Fab color="default"
                                     aria-label="add"
                                     size={'large'}
                                     onClick={this.handleOpenCloseDrawer}
                                >
                                    <MenuSharpIcon style={{fontSize: 30}}/>
                                </Fab>
                            </Tooltip>
                        </div>
                    </Grid>

                    <Grid item
                          xs={11}
                    >
                        <Grid container direction="column">
                            <Grid item xs={12}>
                                <Container maxWidth="xl" className={classes.container}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>

                                            <Card>
                                                <CardHeader title={'Complexity Plot'}/>
                                                <CardContent>
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={2}>
                                                            <a href="#GraphShowOnClick"
                                                               style={{
                                                                   color: 'white',
                                                                   textDecoration: 'none',
                                                               }}
                                                            >
                                                                <Tooltip title={'helper'}>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="default"
                                                                        disableElevation
                                                                        onClick={this.handleDraw}
                                                                    >
                                                                        PLOT GRAPH
                                                                    </Button>
                                                                </Tooltip>
                                                            </a>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <ComplexityPlot/>
                                                        </Grid>

                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        {/**/}
                                        <Grid item xs={12}>
                                            {/*<Element name="GraphShowOnClick" className="element">*/}

                                            <Card style={{
                                                minHeight: 1309
                                            }}>
                                                <CardHeader title={'Graph'}/>
                                                <CardContent>
                                                    <div id="GraphShowOnClick">
                                                        <GraphContainer/>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/*</Element>*/}
                                        </Grid>
                                    </Grid>
                                </Container>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const connectClass = connect(mapStateToProps, actionsCreator)(MainMenu);
export default withStyles(layoutStyle)(connectClass);