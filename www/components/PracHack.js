var React = require('react');
import { NavBar } from './NavBar.js'
import { Patcher } from './Patcher.js';
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
                        <Patcher/>
                    </Grid>
                </ThemeProvider>
            </div>
        )
    }
}