var React = require('react');
import { NavBar } from './NavBar.js'
import { Patcher } from './Patcher.js';
import { Grid, Button, RadioGroup, FormControl, FormLabel, FormControlLabel, Radio, CircularProgress } from "@mui/material"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import "react-discord-invite/dist/style.css";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        textAlign: 'center',
    }
});

export class PracHack extends React.Component {
    constructor(props) {
        super(props);
        console.log("1.0");
    }

    state = {
    }

    render() {
        return (
            <div>
                <NavBar />
                <ThemeProvider theme={darkTheme}>
                    <Grid
                        container
                        spacing={0}
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Patcher />
                    </Grid>
                    <center>
                    <iframe
                        src="https://www.youtube.com/embed/njPkQnrKqTM"
                        width="960"
                        height="480"
                        frameborder="0"
                        allow="autoplay; encrypted-media"
                        allowfullscreen
                        title="video"
                    />{" "}
                    <iframe src="https://discord.com/widget?id=995276566437318667&theme=dark" width="350" height="480" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
                    </center>
                </ThemeProvider>
            </div>
        )
    }
}