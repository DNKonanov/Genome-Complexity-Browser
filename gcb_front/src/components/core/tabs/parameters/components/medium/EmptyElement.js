import React from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";

class EmptyElement extends React.Component {
    render() {
        return (
            <div>
                <Container fixed>
                    <Grid container spacing={3} justify="flex-end" alignItems="stretch">
                        <Grid item xs={12}>
                            <div/>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}


export default EmptyElement;