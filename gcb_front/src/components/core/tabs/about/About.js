import React from "react";
import {Container, Grid, Typography} from '@material-ui/core';

class About extends React.Component {
    render() {
        return (
            <div>
                <Container fixed>
                    <Grid item xs={12}>
                        <Typography>
                            GCB implements visualization of gene neighbourhoods <br></br>
                            in grap-based format and quantifies local variability <br></br>
                            of the genome. The web server contains data for pre-<br></br>
                            calculated species with a subset of the available <br></br>
                            genomes from RefSeq. You may use the standalone version <br></br>
                            to analyze your custom genome set.<br></br>
                            <br></br>
                            Find more at <a href='https://gcb.readthedocs.io'>https://gcb.readthedocs.io/.</a> 

                            <p>Please contact us via  <a href='https://groups.google.com/forum/#!forum/genome-complexiity-browser'>GCB Google Group</a>.</p>
                            
                            Or directly, via e-mail:
                            <p>Aleksander Manolov, paraslonic@gmail.com<br></br>
                            Dmitriy Konanov, konanovdmitriy@gmail.com</p>
                        </Typography>
                        
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default About;