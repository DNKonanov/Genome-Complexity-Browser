import React from "react";
import {connect} from 'react-redux';
import withStyles from "@material-ui/core/styles/withStyles";
import {layoutStyle} from "./styles/LayoutStyle";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import {Card, CardHeader} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import ComplexityPlot from "../../plot/ComplexityPlot";
import GraphContainer from "../../graph/GraphConatiner";
import GraphLayout from "../../graph/GraphLayout";
import Button from "@material-ui/core/Button";


class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollValue: 0,
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = (event) => {
        this.setState({
            scrollValue: window.pageYOffset
        });
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <div className={classes.appBarSpacer}/>

                <Grid
                    container
                    // justify="flex-start"
                    alignItems="flex-start"
                    spacing={0}
                >
                    <Grid item xs={1}>
                        <div style={{
                            marginTop: document.documentElement.clientHeight / 2 - 238 + this.state.scrollValue
                            // '-webkit-transform': 'rotate(90deg)'
                        }}>
                            <Button color="primary"
                                    size='large'
                                    variant="contained"
                            >
                                <p style={{
                                    fontStyle: 'normal',
                                    'display': 'block',
                                }}
                                >
                                    <i style={{fontStyle: 'normal', 'display': 'block',}}>S</i>
                                    <i style={{fontStyle: 'normal', 'display': 'block',}}>E</i>
                                    <i style={{fontStyle: 'normal', 'display': 'block',}}>T</i>
                                    <i style={{fontStyle: 'normal', 'display': 'block',}}>T</i>
                                    <i style={{fontStyle: 'normal', 'display': 'block',}}>I</i>
                                    <i style={{fontStyle: 'normal', 'display': 'block',}}>N</i>
                                    <i style={{fontStyle: 'normal', 'display': 'block',}}>G</i>
                                    <i style={{fontStyle: 'normal', 'display': 'block',}}>S</i>
                                </p>
                            </Button>
                        </div>
                    </Grid>

                    {/*<Grid item xs={11}>*/}
                    {/*    <Card>*/}
                    {/*        <CardHeader title={'Complexity Plot'}/>*/}
                    {/*        <CardContent>*/}
                    {/*            <ComplexityPlot/>*/}
                    {/*        </CardContent>*/}
                    {/*    </Card>*/}
                    {/*</Grid>*/}
                    {/**/}
                    {/*<Grid item xs={11}>*/}
                    {/*    <Card>*/}
                    {/*        <CardHeader title={'Graph'}/>*/}
                    {/*        <CardContent>*/}
                    {/*            <GraphContainer/>*/}
                    {/*            <GraphLayout/>*/}
                    {/*        </CardContent>*/}
                    {/*    </Card>*/}
                    {/*</Grid>*/}
                </Grid>


                {/*<Container maxWidth="xl" className={classes.container}>*/}
                {/*    <Grid container spacing={3}>*/}
                {/*        <Grid item xs={11}>*/}
                {/*            <Card>*/}
                {/*                <CardHeader title={'Complexity Plot'}/>*/}
                {/*                <CardContent>*/}
                {/*                    <ComplexityPlot/>*/}
                {/*                </CardContent>*/}
                {/*            </Card>*/}
                {/*        </Grid>*/}
                {/*/!**!/*/}
                {/*        <Grid item xs={11}>*/}
                {/*            <Card>*/}
                {/*                <CardHeader title={'Graph'}/>*/}
                {/*                <CardContent>*/}
                {/*                    <GraphContainer/>*/}
                {/*                    <GraphLayout/>*/}
                {/*                </CardContent>*/}
                {/*            </Card>*/}
                {/*        </Grid>*/}
                {/*    </Grid>*/}
                {/*</Container>*/}
            </div>

        );
    }
}

const connectClass = connect(null, null)(MainMenu);
export default withStyles(layoutStyle)(connectClass);