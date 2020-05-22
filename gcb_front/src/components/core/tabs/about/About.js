import React from "react";
import Box from "@material-ui/core/Box";
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";


class About extends React.Component {
    render() {
        return (
            <div>
                <Container fixed>
                    <Box>
                        <Card className={this.props.cardInDrawer}>
                            <CardContent>
                                <Grid container direction='column'>
                                    <Typography>User manual(alpha):
                                        <a href='https://github.com/DNKonanov/Genome-Complexity-Browser/blob/master/GCB_manual.pdf'>PDF</a> <br/>
                                    </Typography>

                                    <Typography>Link to github:<br/>
                                        <a href='https://github.com/DNKonanov/Genome-Complexity-Browser'>GitHub</a>
                                    </Typography>

                                    <Typography>Command-line tool:<br/>
                                        <a href='https://github.com/DNKonanov/geneGraph'>geneGraph</a>
                                    </Typography>

                                    <Typography>Stand-alone version of this service:<br/>
                                        <a href='https://github.com/DNKonanov/GCB'>GCB_package</a>
                                    </Typography>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
            </div>
        );
    }
}

export default About;