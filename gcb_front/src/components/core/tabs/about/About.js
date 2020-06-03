import React from "react";
import {Box, Card, CardContent, Container, Grid, Typography} from '@material-ui/core';

class About extends React.Component {
    render() {
        return (
            <div>
                <Container fixed>
                    <Box>
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
                    </Box>
                </Container>
            </div>
        );
    }
}

export default About;