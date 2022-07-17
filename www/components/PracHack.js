var React = require('react');
const vcdiffPlugin = require('@ably/vcdiff-decoder');
import { NavBar } from './NavBar.js'
import '../assets/css/prachack.scss'
import '../assets/css/navbar.scss'
import { echo_string } from "../../pkg/patcher";
import { saveAs } from 'file-saver';
import checksums from "../assets/json/checksums.json"
import crc32 from 'crc/crc32';
import { Grid, Button, RadioGroup, FormControl, FormLabel, FormControlLabel, Radio } from "@mui/material"
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
            return <p className="status-message">Checking file...</p>
    }
}

export class PracHack extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        selectedFile: null,
        selectedFileBuffer: null,
        fileSelectState: FileSelectStates.Initial,
        selectedGame: null,
        selectedPatchFile: null,
        selectedPlatform: "PS1",
    }

    handleFile(e) {
        if (e.target.files.length > 0) {
            this.setState({
                selectedFile: e.target.files[0],
                fileSelectState: FileSelectStates.Calculating,
            });
        }
        else {
            this.setState({
                fileSelectState: FileSelectStates.Invalid,
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.fileSelectState === FileSelectStates.Calculating) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const view = new Int8Array(reader.result);
                const checksum = crc32(view).toString(16);
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

            reader.readAsArrayBuffer(this.state.selectedFile);
        }
    }

    handlePlatform(e) {
        this.setState({
            selectedPlatform: e.target.value,
        });
    }

    async handlePatch(e) {
        let patch = await fetch("assets/patches/" + this.state.selectedPatchFile);
        patch = await patch.arrayBuffer();

        const out = vcdiffPlugin.decode(new Uint8Array(patch), new Uint8Array(this.state.selectedFileBuffer));

        saveAs(new Blob([out]), "testblob.bin");
    }

    render() {
        echo_string("Hello, World!");
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
                        <FormControl>
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
                        />
                        <Button onClick={this.handlePatch.bind(this)} variant="contained" disabled={this.state.fileSelectState === FileSelectStates.Valid ? false : true}>Patch</Button>
                    </Grid>
                </ThemeProvider>
            </div>
        )
    }
}