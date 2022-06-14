var React = require('react');
import styled, { css, createGlobalStyle } from 'styled-components'
import { Leaderboard } from './Leaderboard'
import { Legend } from './Legend'
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import db from '../db.js'
import legend from '../assets/legend.json5';
import overrides from '../assets/overrides.json5';

const games_srcom = db.srcom.exec("SELECT tbl_name from sqlite_master WHERE type = 'table'")[0]["values"];
const games_extras = db.extras.exec("SELECT tbl_name from sqlite_master WHERE type = 'table'")[0]["values"];
let columns = db.srcom.exec(`SELECT * FROM ${games_srcom[0]}`)[0]["columns"];

const Content = styled.div`
`;

const GlobalStyle = createGlobalStyle`
  html {
    background: grey;
  }
`

export class Boards extends React.Component {
    constructor(props) {
        super(props);

        const game = games_srcom[0];
        const columns = db.srcom.exec(`SELECT * FROM ${game[0]}`)[0]["columns"];
        const runs = db.srcom.exec(`SELECT * FROM ${game[0]}`)[0]["values"]
            .concat(games_extras.find(elem => elem == game[0]) ? db.extras.exec(`SELECT * FROM ${game[0]}`)[0]["values"] : [])
            .map(r => {
                return Object.fromEntries(r.map((e, i) => [columns[i], e]));
            })
            .map(r => {
                const picked_hash = _.pick(_.clone(r), ['game', 'category', 'player', 'time', 'date']);
                const hash = Base64.stringify(sha256(JSON.stringify(picked_hash)));
                return _.assign(_.clone(r), overrides[hash]);
            })
            .sort((a, b) => a["time"] - b["time"])

        this.state = {
            game: game,
            columns: columns,
            runs: runs,
            filters: legend.map(l => {
                if (l["filter"]) {
                    return r => !r[(l["name"])]
                }
            })
        }
    }

    handleChange(e) {
        console.log(this.state.filters);
        this.setState({
            game: e.target.value,
            columns: db.srcom.exec(`SELECT * FROM ${e.target.value}`)[0]["columns"],
            runs: db.srcom.exec(`SELECT * FROM ${e.target.value}`)[0]["values"]
                .concat(games_extras.find(elem => elem == e.target.value) ? db.extras.exec(`SELECT * FROM ${e.target.value}`)[0]["values"] : [])
                .map(r => {
                    return Object.fromEntries(r.map((e, i) => [columns[i], e]));
                })
                .map(r => {
                    const picked_hash = _.pick(_.clone(r), ['game', 'category', 'player', 'time', 'date']);
                    const hash = Base64.stringify(sha256(JSON.stringify(picked_hash)));
                    return _.assign(_.clone(r), overrides[hash]);
                })
                .sort((a, b) => a["time"] - b["time"])
        })
    }

    render() {
        return (
            <Content>
                <GlobalStyle />
                <h5>Select game:</h5>
                <select onChange={this.handleChange.bind(this)}>
                    {games_srcom.map((g, i) => (
                        <option key={i} value={g}>{g}</option>
                    ))}
                </select>
                {legend.map((k, i) => {
                    return <Legend text={k["name"]} colour={k["colour"]} key={i} />
                })}
                <Leaderboard game={this.state.game}
                    columns={this.state.columns}
                    runs={this.state.runs}
                    categories={[...new Set(this.state.runs.map(r => r["category"]))]
                        .sort((a, b) => {
                            if (a.charAt(0).match(/[a-zA-Z]/i) && b.charAt(0).match(/[a-zA-Z]/i)) {
                                return a.localeCompare(b)
                            }
                            else return b.localeCompare(a)
                        })
                    }
                    filters={this.state.filters}
                />
            </Content>
        )
    }
}