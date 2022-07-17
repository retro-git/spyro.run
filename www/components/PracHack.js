var React = require('react');
const vcdiffPlugin = require('@ably/vcdiff-decoder');
import { NavBar } from './NavBar.js'
import '../assets/css/prachack.scss'
import '../assets/css/navbar.scss'
import { saveAs } from 'file-saver';
import checksums from "../assets/json/checksums.json"
import { Grid, Button, RadioGroup, FormControl, FormLabel, FormControlLabel, Radio, CircularProgress } from "@mui/material"
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        textAlign: 'center',
    }
});

const FileSelectStates = {
    Initial: Symbol("Initial"),
    Valid: Symbol("Valid"),
    Invalid: Symbol("Invalid"),
    Calculating: Symbol("Calculating"),
    Patching: Symbol("Patching"),
}

const StatusMessage = props => {
    switch (props.fileSelectState) {
        case FileSelectStates.Initial:
            return <p className="status-message">Select a platform and game .bin file to patch:</p>
        case FileSelectStates.Valid:
            return <p className="status-message">{props.selectedGame} - valid game detected - ready to patch.</p>
        case FileSelectStates.Invalid:
            return <p className="status-message">File is invalid</p>
        case FileSelectStates.Calculating:
            return <p className="status-message loading">Checking file <CircularProgress size={15}/></p>
        case FileSelectStates.Patching:
            return <p className="status-message loading">Patching (this may take a little while - ISOs are big) <CircularProgress size={15}/></p>
    }
}

export class PracHack extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        selectedFile: null,
        selectedFileName: null,
        selectedFileBuffer: null,
        fileSelectState: FileSelectStates.Initial,
        selectedGame: null,
        selectedPatchFile: null,
        selectedPlatform: "PS1",
    }

    handleFile(e) {
        if (e.target.files.length > 0) {
            console.log(e.target.files[0]);
            this.setState({
                selectedFile: e.target.files[0],
                selectedFileName: e.target.files[0].name,
                fileSelectState: FileSelectStates.Calculating,
            });
        }
        else {
            this.setState({
                fileSelectState: FileSelectStates.Invalid,
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.fileSelectState === FileSelectStates.Calculating) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const crc_worker = new Worker(new URL('../workers/crc_worker.js', import.meta.url));
                crc_worker.onmessage = (e) => {
                    if (e.data.type === "checksum_complete") {
                        const checksum = e.data.checksum;
                        console.log(checksum);
                        if (checksum in checksums) {
                            this.setState({
                                fileSelectState: FileSelectStates.Valid,
                                selectedGame: checksums[checksum]["game_name"],
                                selectedPatchFile: (checksums[checksum]["patch_prefix"] + "_" + this.state.selectedPlatform + ".vcdiff").toLowerCase(),
                                selectedFileBuffer: reader.result,
                            });
                        }
                        else {
                            this.setState({
                                fileSelectState: FileSelectStates.Invalid,
                            });
                        }
                    }
                };
                crc_worker.postMessage({
                    file: reader.result,
                });
            }

            reader.readAsArrayBuffer(this.state.selectedFile);
        }
        else if (this.state.fileSelectState === FileSelectStates.Patching) {
            let patch = await fetch("assets/patches/" + this.state.selectedPatchFile);
            patch = await patch.arrayBuffer();

            const patch_worker = new Worker(new URL('../workers/patch_worker.js', import.meta.url));
            patch_worker.onmessage = (e) => {
                if (e.data.type === "patch_complete") {
                    const patched_file = new Blob([e.data.patched_file], { type: "application/octet-stream" });
                    saveAs(patched_file, this.state.selectedFileName);
                    this.setState({
                        fileSelectState: FileSelectStates.Valid,
                    });
                }
            };
            patch_worker.postMessage({
                patch: patch,
                file: this.state.selectedFileBuffer,
            });
        }
    }

    handlePlatform(e) {
        this.setState({
            selectedPlatform: e.target.value,
        });
    }

    async handlePatch(e) {
        this.setState({
            fileSelectState: FileSelectStates.Patching,
        });
    }

    render() {
        return (
            <div>
                <NavBar />
                <ThemeProvider theme={darkTheme}>
                    <StatusMessage {...this.state} className="status-message" />
                    <Grid
                        container
                        spacing={0}
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <FormControl disabled={this.state.fileSelectState === FileSelectStates.Patching || this.state.fileSelectState === FileSelectStates.Calculating ? true : false}>
                            <FormLabel id="demo-radio-buttons-group-label"></FormLabel>
                            <RadioGroup row
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="PS1"
                                name="radio-buttons-group"
                                onChange={this.handlePlatform.bind(this)}

                            >
                                <FormControlLabel value="PS1" control={<Radio />} label="PS1" />
                                <FormControlLabel value="PS2" control={<Radio />} label="PS2" />
                            </RadioGroup>
                        </FormControl>
                        <input className='file-input'
                            type="file"
                            accept=".bin"
                            onChange={this.handleFile.bind(this)}
                            disabled={this.state.fileSelectState === FileSelectStates.Patching || this.state.fileSelectState === FileSelectStates.Calculating ? true : false}
                        />
                        <Button onClick={this.handlePatch.bind(this)} variant="contained" disabled={this.state.fileSelectState === FileSelectStates.Valid ? false : true}>Patch</Button>
                    </Grid>
                </ThemeProvider>
            </div>
        )
    }
}