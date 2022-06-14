var React = require('react');
import styled, { css, createGlobalStyle } from 'styled-components'
import { Leaderboard } from './Leaderboard'
import { Legend } from './Legend'
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import db from '../db.js'
import legend from '../assets/legend.json5';
import overrides from '../assets/overrides.json5';
import _ from 'lodash';

// I assure you, dear reader, ignoring the benefits of styled and simply using an external file is necessary
import './test.scss'

const games_srcom = db.srcom.exec("SELECT tbl_name from sqlite_master WHERE type = 'table'")[0]["values"];
const games_extras = db.extras.exec("SELECT tbl_name from sqlite_master WHERE type = 'table'")[0]["values"];
let columns = db.srcom.exec(`SELECT * FROM ${games_srcom[0]}`)[0]["columns"];

const Content = styled.div`
`;

const GlobalStyle = createGlobalStyle``

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
                return _.assign(_.assign(_.clone(r), overrides[hash]), { "hash": hash });
            })
            .sort((a, b) => a["time"] - b["time"])

        this.state = {
            game: game,
            columns: columns,
            runs: runs,
            legend_status: legend.reduce((o, l) => Object.assign(o, {[l["name"]]: _.omit(_.clone(l), ["name"])}), {})
        }
    }

    handleChange(e) {
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

    handleChangeFilter(e) {        
        let ls = _.clone(this.state.legend_status);
        ls[e.target.dataset["name"]]["filter"] = !ls[e.target.dataset["name"]]["filter"];

        this.setState({
            game: this.state.game,
            columns: this.state.columns,
            runs: this.state.runs,
            legend_status: ls
        });
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
                {Object.keys(this.state.legend_status).map((k, i) => {
                    return <Legend name={k} checked={this.state.legend_status[k]["filter"]} l={this.state.legend_status[k]} handleChangeFilter={this.handleChangeFilter.bind(this)} key={i} />
                })}
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
                    filters={Object.keys(this.state.legend_status).map(k => {
                        if (!this.state.legend_status[k]["filter"]) {
                            return r => !r[k]
                        }
                    })}
                />
            </Content>
        )
    }
}