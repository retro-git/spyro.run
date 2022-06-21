var React = require('react');
import styled, { css, createGlobalStyle } from 'styled-components'
import { Leaderboard } from './Leaderboard'
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import db from '../db.js'
import overrides from '../assets/json/overrides.json5';
import _ from 'lodash';
import platform_abbr from '../assets/json/platform_abbr.json5';
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import { NavBar } from '../components/NavBar.js'
import Autocomplete from "@mui/material/Autocomplete";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import games from "../assets/json/games.json5"
import TextField from "@mui/material/TextField";
import { createFilterOptions } from '@mui/material/Autocomplete';
import "../assets/css/DatePicker.scss"
import "../assets/css/Calendar.scss"

// I assure you, dear reader, ignoring the benefits of styled and simply using an external file is necessary
import '../assets/css/boards.scss'

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        textAlign: 'center',
    }
});

const filterOptions = createFilterOptions({
    limit: 15,
});

const games_srcom = db.srcom.exec("SELECT tbl_name from sqlite_master WHERE type = 'table'")[0]["values"];
const games_extras = db.extras.exec("SELECT tbl_name from sqlite_master WHERE type = 'table'")[0]["values"];

const Content = styled.div`
    text-align:center;
`;

const GlobalStyle = createGlobalStyle``

export class Boards extends React.Component {
    constructor(props) {
        super(props);

        //const game = games_srcom[0][0];
        const game = games[0].id;
        const date = new Date();

        const data = this.getData(date, game);

        this.state = {
            game: data.game,
            columns: data.columns,
            runs: data.runs,
            date: date,
            game: game,
            minDate: data.minDate,
            date: data.date,
        }
    }

    getData(date, game) {
        let srcom_data = db.srcom.exec(`SELECT * FROM ${game}`)[0];
        const columns = srcom_data["columns"];

        let extras_data;

        try {
            extras_data = db.extras.exec(`SELECT * FROM ${game}`)[0];
        } catch (error) {
            extras_data = [];
        }

        let runs = srcom_data["values"]
            .concat(!(_.isEmpty(extras_data)) && games_extras.find(elem => elem == game) ? extras_data["values"] : [])
            .map(r => {
                return Object.fromEntries(r.map((e, i) => {
                    if (columns[i] == "platform") {
                        if (platform_abbr[e]) e = platform_abbr[e];
                    }
                    return [columns[i], e];
                }));
            })
            .map(r => {
                const picked_hash = _.assign({ "game": game }, (_.pick(_.clone(r), ['category', 'player', 'time', 'date', 'id'])));
                const hash = Base64.stringify(sha256(JSON.stringify(picked_hash)));
                return _.assign(_.assign(_.clone(r), overrides[hash]), { "hash": hash });
            })

        const minDate = new Date(_.clone(runs).sort((a, b) => new Date(a["date"]) - new Date(b["date"])).filter(r => r["date"])[0].date);
        if (minDate > date) date = minDate;

        runs = runs.filter(r => {
            return new Date(r["date"]) <= date;
        })

        return {
            game: game,
            columns: columns,
            runs: runs,
            minDate: minDate,
            date: date,
        }
    }

    handleChangeGame(e, value) {
        const data = this.getData(this.state.date, value.id);

        this.setState({
            game: data.game,
            columns: data.columns,
            runs: data.runs,
            game: value.id,
            minDate: data.minDate,
            date: data.date,
        })
    }

    handleChangeDate(e) {
        const data = this.getData(e, this.state.game);

        this.setState({
            game: data.game,
            columns: data.columns,
            runs: data.runs,
            date: e,
        })
    }

    render() {
        return (
            <div>
                <NavBar />
                <DatePicker minDate={this.state.minDate} maxDate={new Date()} value={this.state.date} onChange={this.handleChangeDate.bind(this)} />
                <ThemeProvider theme={darkTheme}>
                    <Autocomplete
                        filterOptions={filterOptions}
                        fullWidth
                        disableClearable
                        sx={{ width: "20vw", margin: "auto" }}
                        onChange={this.handleChangeGame.bind(this)}
                        options={games}
                        getOptionLabel={(o) => o.name}
                        defaultValue={games[0]}
                        renderInput={(params) => (
                            <TextField {...params} label="Select game" />
                        )}
                    />
                </ThemeProvider>
                <Leaderboard game={this.state.game}
                    columns={Object.keys(this.state.runs[0])}
                    runs={this.state.runs}
                    categories={[...new Set(this.state.runs.map(r => r["category"]))]
                        .sort((a, b) => {
                            if (a.charAt(0).match(/[a-zA-Z]/i) && b.charAt(0).match(/[a-zA-Z]/i)) {
                                return a.localeCompare(b)
                            }
                            else return b.localeCompare(a)
                        })
                    }
                    mode={this.props.mode}
                    sort={this.props.sort}
                    sort_order={this.props.sort_order}
                />
            </div>
        )
    }
}