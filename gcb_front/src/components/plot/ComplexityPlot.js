import React from "react";
import Grid from "@material-ui/core/Grid";
import {Container, withStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Plot from "react-plotly.js";
import {connect} from 'react-redux';
import CloudDownloadRoundedIcon from '@material-ui/icons/CloudDownloadRounded';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import BackupRoundedIcon from '@material-ui/icons/BackupRounded';


const mapStateToProps = state => ({
    complexity_windows: state.reference.complexity_windows,
    complexity: state.reference.complexity,
});

class ComplexityPlot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            org: 'Escherichia_coli_300_genomes',
            stamm: 'GCF_000284495.1_ASM28449v1',
            genome_name: '',
            contig: 'NC_011993.1',

            og_start: 'OG0001707',
            og_end: 'OG0001707',
            coord_start: 0,
            coord_end: 0,

            pars: false,
            operons: true,

            methods: [
                'by strains complexity',
                'probabilistic complexity',
            ],
            method: 'probabilistic complexity',
            user_coordinates_str: '',
            user_coordinates: [],
            user_values: [],
            draw_types: ['line', 'markers'],
            draw_type: 'line',
            data: '',
            src: '',
            complexity_window: 20,
            search_query: '',
            search_results: [],
            max_user_value: 1
        };
    }

    // удаляет отрисовванные координаты
    deleteUserCoordinates = (e) => {

        this.setState({
            user_coordinates: [],
            user_coordinates_str: ''
        })
        e.preventDefault()
    };
    // открыте файла с клиента
    inputFileChanged = (e) => {

        if (window.FileReader) {
            let file = e.target.files[0], reader = new FileReader();
            reader.onload = function (r) {
                this.setState({
                    user_coordinates_str: r.target.result
                });
            }.bind(this)
            reader.readAsText(file);
        } else {
            alert('Sorry, your browser does\'nt support for preview');
        }

        e.preventDefault()
    };

    // загружает пользовательские координаты
    drawUserCoordinates = (e) => {
        if (this.state.user_coordinates_str.length !== 0) {

            let string = this.state.user_coordinates_str;

            let lines;
            lines = string.split('\n');
            this.setState({user_coordinates: []});
            let coord = [];
            let values = [];

            let max_coord = -Infinity

            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].replace(' ', '\t').split('\t');
                coord.push(parseInt(line[0], 10));

                let v = parseFloat(line[1])
                if (v > max_coord) {
                    max_coord = v
                }
                values.push(-v)
            }

            this.setState({
                user_coordinates: coord,
                user_values: values,
                max_user_value: max_coord
            })
        }
        e.preventDefault()
    };

// грузит файл с профилем сложности
    downloadData = (e) => {
        let data = 'organism=' + this.state.org + '\tgenome=' + this.state.stamm + '\tcontig=' + this.state.contig + '\tmethod=' + this.state.method + '\n'
        data = data + 'position\tcomplexity\n';
        for (let i = 0; i < this.props.complexity.coord_list.length; i++) {
            data = data + this.props.complexity.coord_list[i] + '\t' + this.props.complexity.complexity[i] + '\n'
        }

        let element = document.createElement("a");
        let file = new Blob([data], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = this.state.contig + ".txt";
        element.click();
    };

    render() {
        const data = this.props.complexity;
        const {classes} = this.props;
        return (
            <div>
                <Container fixed>
                    <Grid container
                          direction="column"
                          justify="flex-start"
                          alignItems="stretch"
                    >
                        <Grid item>
                            <Grid container direction="row" justify="flex-start" alignItems="flex-start"
                                  style={{width: '100%'}}>

                                <Grid item>
                                    <Button
                                        style={{margin: 6}}
                                        variant="contained"
                                        color="primary"
                                        component="label"
                                        startIcon={<BackupRoundedIcon/>}
                                    >
                                        Load file
                                        <input
                                            onChange={(e) => {
                                                this.inputFileChanged(e)
                                            }}
                                            style={{display: 'none'}}
                                            type="file"
                                        />
                                    </Button>
                                </Grid>

                                <Grid item>
                                    <Button
                                        style={{margin: 6}}
                                        variant="contained"
                                        color="primary"
                                        component="label"
                                        onClick={(e) => {
                                            this.drawUserCoordinates(e)
                                        }}
                                    >
                                        Show user coordinates
                                    </Button>
                                </Grid>

                                <Grid item>
                                    <Button
                                        style={{margin: 6}}
                                        variant="contained"
                                        color="secondary"
                                        component="label"
                                        startIcon={<DeleteForeverRoundedIcon/>}
                                        onClick={(e) => {
                                            this.deleteUserCoordinates(e)
                                        }}
                                    >
                                        Delete user coordinates
                                    </Button>
                                </Grid>

                                <Grid item>
                                    <FormControl className={classes.formControl}>
                                        <Select style={{margin: 6}} value={this.state.draw_type} name='draw_types'
                                                onChange={e => this.setState({draw_type: e.target.value})}>
                                            {this.state.draw_types.map(draw_type => <MenuItem key={draw_type}
                                                                                              value={draw_type}>{draw_type}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>


                                <Grid item>
                                    {this.state.user_coordinates_str.length === 0 ?
                                        <Typography style={{margin: 6}}>
                                            User coordinates are not loaded
                                        </Typography> :
                                        <Typography style={{margin: 6}}>
                                            Coordinates was loaded succesfully
                                        </Typography>}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Plot
                                data={[
                                    {
                                        x: data.coord_list,
                                        y: data.complexity,
                                        text: data.OGs,
                                        type: 'line',
                                        name: 'complexity'
                                    },

                                    {
                                        x: [this.state.coord_start, this.state.coord_start],
                                        y: [-data.max_complexity / 2, data.max_complexity],
                                        mode: 'lines',
                                        name: 'left edge'
                                    },
                                    {
                                        x: [this.state.coord_end, this.state.coord_end],
                                        y: [-data.max_complexity / 2, data.max_complexity],
                                        mode: 'lines',
                                        name: 'rigth edge'
                                    },

                                    {
                                        x: this.state.user_coordinates,
                                        y: this.state.user_values,
                                        mode: this.state.draw_type,
                                        name: 'user values',
                                        opacity: 0.5,
                                        yaxis: 'y2',
                                        marker: {
                                            size: 5,
                                        },
                                    }
                                ]}
                                layout={
                                    {
                                        autosize: true,
                                        title: 'Genome complexity, ' + data.request.org + ', contig ' + data.request.contig + ', ' + data.request.method,

                                        xaxis: {
                                            title: 'Chromosome position, bp',
                                        },

                                        yaxis: {
                                            range: [-data.max_complexity, data.max_complexity],
                                            title: 'complexity',
                                            overlaying: 'y2'
                                        },

                                        yaxis2: {
                                            range: [-this.state.max_user_value, this.state.max_user_value],
                                            title: 'user values',
                                            side: 'right'
                                        }
                                    }
                                }
                                useResizeHandler={true}
                                style={{width: "100%", height: "400"}}
                                onClick={(data) => {
                                    this.setState({
                                        og_start: data.points[0].text,
                                        og_end: data.points[0].text,
                                        coord_start: data.points[0].x,
                                        coord_end: data.points[0].x
                                    });
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                style={{margin: 6}}
                                variant="contained"
                                color="default"
                                component="label"
                                startIcon={<CloudDownloadRoundedIcon/>}
                                onClick={(e) => {
                                    this.downloadData(e)
                                }}
                            >
                                Download data
                            </Button>

                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}

const useStyle = theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
});
const connectComplexityPlot = connect(mapStateToProps)(ComplexityPlot);
export default withStyles(useStyle)(connectComplexityPlot);